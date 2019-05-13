exports.sortByDate = function(date1, date2) {
    let a = new Date(date1.date);
    let b = new Date(date2.date);
    return b.getTime() - a.getTime();
}

exports.shuffle = function(array) {

    if(!array) return [];
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}