// modify below version counter if changes are made to the Player
// interface in index.d.ts
const VERSION = {
    number: "0.0.0",
    isBeta: false,
    isPrerelease: false,
    name: "Indev",
};
import './typingdeclarations.js';
let saveTimeout;
let updateInterval;
let popupNumber = 0;
let updateDateCheck;
function getInitialPlayer() {
    return {
        VERSION: VERSION,
        v: {
            berries: {
                v: 0n,
            },
            sticks: {
                v: 0n
            },
        }
    };
}
export function getVersionString(version) {
    let { number, isBeta, isPrerelease, name } = version;
    return (isBeta ? "Beta " : isPrerelease ? "Pre-release " : "") + number + " " + name ?? "";
}
export function initTimeouts(saveInfo, updateInfo) {
    saveTimeout = setTimeout(saveInfo.func, saveInfo.time, saveInfo.param);
    updateInterval = setTimeout(updateInfo.func, updateInfo.time, updateInfo.param);
}
export function errorPopup(error) {
    popupNumber++;
    const PopupContainer = $(".popupContainer");
    PopupContainer.append($(`<div id="Error${popupNumber}" class="error popup"></div>`));
    const newElement = $(`#Error${popupNumber}`);
    if (typeof error != 'string')
        error = error.toString();
    newElement.text("There was an error processing game logic. Please report the following: " + error)
        .css({ opacity: 1 });
    setTimeout(() => newElement.fadeOut(2000, 'linear', function () {
        this.remove();
    }), 20000);
    console.error(error);
}
export function savePopup() {
    popupNumber++;
    const PopupContainer = $('.popupContainer');
    PopupContainer.append($(`<div id="savePopup${popupNumber}" class="save popup">Saved game</div>`));
    const prevSaveCount = Array.from(document.querySelectorAll('.save')).length;
    $(`#savePopup${popupNumber}`)
        .css({ opacity: 1, top: prevSaveCount * 36 })
        .fadeOut(2000, 'linear', function () {
        this.remove();
        document.querySelectorAll('.save').forEach((element, index) => {
            let e = element;
            e.style.top = (Number(e.style.top) - (36 * index)).toString();
        });
    });
}
export function inGameErrorHandle(error) {
    if (typeof error !== 'string') {
        console.log(error.toString());
        return;
    }
    console.log(error);
    errorPopup(error);
}
export function save(player) {
    const storedPlayer = JSON.stringify(player);
    window.localStorage.setItem('player', storedPlayer);
    savePopup();
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(save, 14000, player);
    return storedPlayer;
}
export function load() {
    let player;
    const localStorageVersion = localStorage.getItem('player');
    try {
        if (localStorageVersion == null || localStorageVersion == "undefined" || localStorageVersion == 'reset') {
            player = getInitialPlayer();
            return player;
        }
        player = JSON.parse(localStorageVersion, (_key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.slice(0, -1));
            }
            return value;
        });
        console.log(player);
        return player;
    }
    catch (err) {
        errorPopup("We've been unable to process your save file. Please wipe your save."); // TODO: set up a support channel on discord
        throw err;
    }
}
export function Update(textUpdate) {
    if (typeof textUpdate !== 'function')
        throw 'Bruh';
    const currentDate = Date.now();
    if (updateDateCheck === undefined)
        updateDateCheck = currentDate;
    if ((currentDate - updateDateCheck >= 100)) {
        textUpdate();
    }
    updateDateCheck = Date.now();
    updateInterval = setTimeout(Update, 100, textUpdate);
}
export function colRight(button) {
    const newColumn = $('<div class="col right"></div>');
    $('#game').append(newColumn);
    $('#main').css({ "width": "49.5%" });
    newColumn.append($('<button id="return" class="return">←</button>'));
    $('#return').on("click", (event) => {
        event.preventDefault();
        $('#main').css({ "width": "100%" });
        $('#game').children('.col').remove();
        button.show();
    });
    button.hide();
    return newColumn;
}
export function unCol(button) {
    $('#main').css({ "width": "100%" });
    $('#game').children('.col').remove();
    button.show();
}
