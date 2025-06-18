/**
 * Estimate time limit per test case in seconds.
 * @param {number} inputSize - Maximum input size.
 * @param {string} expectedComplexity - Big-O complexity like "O(n log n)", "O(n^2)", etc.
 * @param {number} [opsPerSecond=1e8] - Machine's estimated operations per second.
 * @returns {number} - Expected time in seconds (minimum 1s).
 */
export function getExpectedTimeLimit(inputSize, expectedComplexity, opsPerSecond = 1e8) {
    let estimatedOperations;
  
    switch (expectedComplexity) {
      case "O(1)":
        estimatedOperations = 1;
        break;
      case "O(log n)":
        estimatedOperations = Math.log2(inputSize);
        break;
      case "O(n)":
        estimatedOperations = inputSize;
        break;
      case "O(n log n)":
        estimatedOperations = inputSize * Math.log2(inputSize);
        break;
      case "O(n^2)":
        estimatedOperations = inputSize ** 2;
        break;
      case "O(n^3)":
        estimatedOperations = inputSize ** 3;
        break;
      default:
        estimatedOperations = inputSize;
    }
  
    const estimatedTime = estimatedOperations / opsPerSecond;
    return Math.max(1, Number(estimatedTime.toFixed(2))); // Minimum 1s
  }




  /**
 * Estimate memory usage per test case in MB.
 * @param {number} inputSize - Maximum input size.
 * @param {number} [perElementBytes=4] - Bytes per input element (default 4 bytes).
 * @param {number} [bufferMB=1] - Extra memory buffer in MB.
 * @returns {number} - Expected memory in MB (minimum 32MB).
 */
export function getExpectedMemoryLimit(inputSize, perElementBytes = 4, bufferMB = 1) {
    const totalBytes = inputSize * perElementBytes + bufferMB * 1024 * 1024;
    const memoryMB = totalBytes / (1024 * 1024);
    return Math.max(32, Number(memoryMB.toFixed(2))); // Minimum 32MB
  }
  
  