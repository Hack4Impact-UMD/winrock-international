/**
 * Splits an array into smaller batches of a specified size.
 * Useful for making API requests in batches.
 *
 * @param array - The original array to split.
 * @param batchSize - The maximum size of each batch.
 * 
 * @returns An array of batches (sub-arrays).
 */
function batchArray<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
  
    for (let i = 0; i < array.length; i += batchSize) {
        batches.push(array.slice(i, i + batchSize));
    }
  
    return batches;
}

export { batchArray };