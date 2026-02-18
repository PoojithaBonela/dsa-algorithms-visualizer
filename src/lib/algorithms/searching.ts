import type { AlgorithmTrace, TraceStep } from './types';

export const generateLinearSearchTrace = (array: number[], target: number): AlgorithmTrace => {
    const steps: TraceStep[] = [];

    // Initial State
    steps.push({
        array: [...array],
        type: 'SET',
        indices: [],
        message: `Starting Linear Search for target value: ${target}`
    });

    for (let i = 0; i < array.length; i++) {
        // Highlight current element
        steps.push({
            array: [...array],
            type: 'HIGHLIGHT',
            indices: [i],
            message: `Checking index ${i}: Is ${array[i]} equal to ${target}?`
        });

        // Compare
        steps.push({
            array: [...array],
            type: 'COMPARE',
            indices: [i],
            message: `Comparing ${array[i]} with target ${target}`
        });

        if (array[i] === target) {
            // Found
            steps.push({
                array: [...array],
                type: 'HIGHLIGHT', // We can use a specific color in Visualizer if needed, usually sorted/found uses green
                indices: [i],
                message: `Found target ${target} at index ${i}!`
            });
            steps.push({
                array: [...array],
                type: 'DONE',
                indices: [i],
                message: `Search successful! Found ${target} at index ${i}.`
            });
            return { steps };
        }
    }

    // Not Found
    steps.push({
        array: [...array],
        type: 'DONE',
        indices: [],
        message: `Target ${target} not found in the array.`
    });

    return { steps };
};

export const generateBinarySearchTrace = (initialArray: number[], target: number): AlgorithmTrace => {
    const steps: TraceStep[] = [];

    const array = [...initialArray].sort((a, b) => a - b);
    let low = 0;
    let high = array.length - 1;

    // Initial State (Sorted)
    steps.push({
        array: [...array],
        type: 'SET',
        indices: [],
        activeRange: [low, high],
        message: `Binary Search requires a sorted array. Sorted input: [${array.join(', ')}]`
    });

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        // Highlight the current range
        const rangeIndices = [];
        for (let i = low; i <= high; i++) rangeIndices.push(i);

        steps.push({
            array: [...array],
            type: 'HIGHLIGHT',
            indices: rangeIndices,
            activeRange: [low, high],
            message: `Searching in range [${low}, ${high}]`
        });

        steps.push({
            array: [...array],
            type: 'COMPARE',
            indices: [mid],
            activeRange: [low, high],
            message: `Inspect Middle Element at index ${mid}: ${array[mid]}`
        });

        if (array[mid] === target) {
            steps.push({
                array: [...array],
                type: 'DONE',
                indices: [mid],
                activeRange: [low, high],
                message: `Found target ${target} at index ${mid}!`
            });
            return { steps };
        } else if (array[mid] < target) {
            steps.push({
                array: [...array],
                type: 'HIGHLIGHT',
                indices: [mid],
                activeRange: [low, high],
                message: `${array[mid]} < ${target}. Ignore left half.`
            });
            low = mid + 1;
        } else {
            steps.push({
                array: [...array],
                type: 'HIGHLIGHT',
                indices: [mid],
                activeRange: [low, high],
                message: `${array[mid]} > ${target}. Ignore right half.`
            });
            high = mid - 1;
        }
    }

    // Not Found
    steps.push({
        array: [...array],
        type: 'DONE',
        indices: [],
        message: `Target ${target} not found in the array.`
    });

    return { steps };
};
