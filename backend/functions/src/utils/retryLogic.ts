// Sleeps for the given # of milliseconds
function sleep(ms: number) { return new Promise(_ => setTimeout(_, ms)); }

/**
 * Executes the given function with exponential backing retry logic.
 * 
 * @param fn - The function to execute with retry logic.
 * @param maxRetries - The # of retries before throwing the error.
 * @param initialDelay - The delay to start with and double until success (or until maxRetries is reached).
 * 
 * @returns - The result of the function, if successful.
 */
async function withRetries<T>(fn: () => Promise<T>, maxRetries: number = 3, initialDelay: number = 1000): Promise<T> {
    let attempt = 0;
    let delay = initialDelay;

    await sleep(delay);

    while (attempt <= maxRetries) {
        try {
            return await fn();
        } catch (error: any) {
            if (attempt >= maxRetries) {
                throw error;
            }

            console.warn(`Retry attempt ${++attempt} failed:`, error.message || error);
            await sleep(delay);
            delay *= 2;
        }
    }

    throw new Error("Unexpected retry loop exit");
}

export { withRetries };