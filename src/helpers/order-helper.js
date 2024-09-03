import { shuffle } from "lodash";

export function randomOrder(size = 4) {
  // Create an array from 0 to size-1
  const array = Array.from({ length: size }, (_, index) => index);

  // Shuffle the array using lodash's shuffle function
  return shuffle(array);
}

export function applyOrder(array, seed) {
  if (seed && seed.length == array.length) {
    const sortedArray = [];
    for (let i = 0; i < array.length; i++) {
      sortedArray.push(array[seed[i]]);
    }
    return sortedArray;
  }
  return array;
}
