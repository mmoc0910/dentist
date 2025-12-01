export const numInArray = (num, arr) => {
    if (arr) {
        const found = arr?.find(element => element === num);
        return found ? true : false
    }
    return false;
}