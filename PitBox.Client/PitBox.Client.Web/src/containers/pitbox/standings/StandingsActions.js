export const SET_STANDINGS = 'SET_STANDINGS';
export const SET_SELECTED_CAR = 'SET_SELECTED_CAR';

export const standingsClear = () => {
    return {
        type: SET_STANDINGS,
        standings: [],
    };
}

export const standingsUpdate = (standings) => {
    return {
        type: SET_STANDINGS,
        standings: standings
    };
}

export const setSelectedCar = (carNumber) => {
    return {
        type: SET_SELECTED_CAR,
        carNumber: carNumber
    };
}

