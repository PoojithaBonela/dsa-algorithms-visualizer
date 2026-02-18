import type { AlgorithmTrace, TraceStep } from './types';

export const generateBubbleSortTrace = (inputArray: number[]): AlgorithmTrace => {
    const arr = [...inputArray];
    const steps: TraceStep[] = [];

    // Initial step
    steps.push({
        type: 'SET',
        indices: [],
        array: [...arr],
        message: 'Starting Bubble Sort'
    });

    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Comparison
            steps.push({
                type: 'COMPARE',
                indices: [j, j + 1],
                array: [...arr],
                message: `Comparing ${arr[j]} and ${arr[j + 1]}`
            });

            if (arr[j] > arr[j + 1]) {
                // Swap
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;

                steps.push({
                    type: 'SWAP',
                    indices: [j, j + 1],
                    array: [...arr],
                    message: `Swapping ${arr[j + 1]} and ${arr[j]}`
                });
            }
        }

        // Highlighting sorted element
        steps.push({
            type: 'HIGHLIGHT',
            indices: [n - i - 1],
            array: [...arr],
            message: `Element at index ${n - i - 1} is now in its sorted position.`
        });

        if (!swapped) {
            steps.push({
                type: 'HIGHLIGHT',
                indices: Array.from({ length: n - i - 1 }, (_, index) => index),
                array: [...arr],
                message: 'No swaps occurred, array is sorted.'
            });
            break;
        }
    }

    steps.push({
        type: 'DONE',
        indices: [],
        array: [...arr],
        message: 'Bubble Sort completed'
    });

    return { steps };
};

export const generateSelectionSortTrace = (initialArray: number[]): AlgorithmTrace => {
    const steps: TraceStep[] = [];
    const array = [...initialArray];
    const n = array.length;

    // Initial State
    steps.push({
        array: [...array],
        type: 'SET',
        indices: [],
        message: 'Starting Selection Sort visualization...'
    });

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        // Highlight current position i
        steps.push({
            array: [...array],
            type: 'HIGHLIGHT',
            indices: [i],
            message: `Current minimum is ${array[i]} at index ${i}`
        });

        for (let j = i + 1; j < n; j++) {
            // Compare
            steps.push({
                array: [...array],
                type: 'COMPARE',
                indices: [minIndex, j],
                message: `Comparing current minimum ${array[minIndex]} with ${array[j]}`
            });

            if (array[j] < array[minIndex]) {
                minIndex = j;
                steps.push({
                    array: [...array],
                    type: 'HIGHLIGHT',
                    indices: [minIndex],
                    message: `Found new minimum: ${array[minIndex]}`
                });
            }
        }

        // Swap if needed
        if (minIndex !== i) {
            const temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;

            steps.push({
                array: [...array],
                type: 'SWAP',
                indices: [i, minIndex],
                message: `Swapped minimum ${array[i]} with ${array[minIndex]}`
            });
        }

        // Mark sorted
        steps.push({
            array: [...array],
            type: 'HIGHLIGHT',
            indices: [i],
            message: `${array[i]} is now sorted`
        });
    }

    // Final sorted state
    steps.push({
        array: [...array],
        type: 'DONE',
        indices: [],
        message: 'Array is completely sorted!'
    });

    return { steps };
};

export const generateInsertionSortTrace = (initialArray: number[]): AlgorithmTrace => {
    const steps: TraceStep[] = [];
    const array = [...initialArray];
    const n = array.length;

    // Initial State
    steps.push({
        array: [...array],
        type: 'SET',
        indices: [],
        message: 'Starting Insertion Sort visualization...'
    });

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        steps.push({
            array: [...array],
            type: 'HIGHLIGHT',
            indices: [i],
            message: `Selected key ${key} at index ${i}`
        });

        while (j >= 0 && array[j] > key) {
            steps.push({
                array: [...array],
                type: 'COMPARE',
                indices: [j, j + 1],
                message: `Comparing ${array[j]} > ${key}`
            });

            array[j + 1] = array[j];

            steps.push({
                array: [...array],
                type: 'SWAP',
                indices: [j, j + 1],
                message: `Moving ${array[j]} to the right`
            });

            j--;
        }

        array[j + 1] = key;

        steps.push({
            array: [...array],
            type: 'HIGHLIGHT',
            indices: [j + 1],
            message: `Inserted ${key} at index ${j + 1}`
        });
    }

    // Final sorted state
    steps.push({
        array: [...array],
        type: 'DONE',
        indices: [],
        message: 'Array is completely sorted!'
    });

    return { steps };
};

export const generateQuickSortTrace = (initialArray: number[]): AlgorithmTrace => {
    const steps: TraceStep[] = [];
    const array = [...initialArray];

    // Initial State
    steps.push({
        array: [...array],
        type: 'SET',
        indices: [],
        message: 'Starting Quick Sort visualization...'
    });

    const partition = (arr: number[], low: number, high: number) => {
        const pivot = arr[high];

        steps.push({
            array: [...arr],
            type: 'HIGHLIGHT',
            indices: [high],
            message: `Selected pivot: ${pivot}`
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...arr],
                type: 'COMPARE',
                indices: [j, high],
                message: `Comparing ${arr[j]} with pivot ${pivot}`
            });

            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    const temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;

                    steps.push({
                        array: [...arr],
                        type: 'SWAP',
                        indices: [i, j],
                        message: `Swapping ${arr[i]} and ${arr[j]}`
                    });
                }
            }
        }

        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        if (i + 1 !== high) {
            steps.push({
                array: [...arr],
                type: 'SWAP',
                indices: [i + 1, high],
                message: `Moving pivot to correct position`
            });
        }

        steps.push({
            array: [...arr],
            type: 'HIGHLIGHT',
            indices: [i + 1],
            message: `Pivot ${pivot} is now at its sorted position`
        });

        return i + 1;
    };

    const quickSort = (arr: number[], low: number, high: number) => {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    };

    quickSort(array, 0, array.length - 1);

    // Final sorted state
    steps.push({
        array: [...array],
        type: 'DONE',
        indices: [],
        message: 'Array is completely sorted!'
    });

    return { steps };
};

export const generateMergeSortTrace = (initialArray: number[]): AlgorithmTrace => {
    const steps: TraceStep[] = [];
    // We keep track of all nodes created so far.
    // In a real tree visualization, we might want to prune, but for this visualizer, 
    // we'll keep the structure to show the decomposition.
    let nodes: import('./types').MergeNode[] = [{
        id: 'root',
        values: [...initialArray],
        level: 0,
        status: 'active',
        children: []
    }];

    let recursionStack: string[] = [`mergeSort(${initialArray.join(', ')})`];

    // Helper to push a step with current state
    const addStep = (type: import('./types').TraceAction, message: string, activeNodeId?: string, highlightIndices: number[] = []) => {
        steps.push({
            type,
            array: [], // Not used for this main visualizer mode anymore, keeping empty or final
            indices: highlightIndices,
            nodes: JSON.parse(JSON.stringify(nodes)), // Deep copy to snapshot state
            recursionStack: [...recursionStack],
            activeNodeId,
            message
        });
    };

    // Initial State
    addStep('SET', 'Starting Merge Sort Tree Visualization...', 'root');

    const mergeSortRecursive = (nodeId: string): number[] => {
        const nodeIndex = nodes.findIndex(n => n.id === nodeId);
        if (nodeIndex === -1) return [];

        const node = nodes[nodeIndex];
        const arr = node.values;

        // Mark current node as active
        nodes = nodes.map(n => ({
            ...n,
            status: n.id === nodeId ? 'active' : (n.status === 'sorted' ? 'sorted' : 'inactive')
        }));

        if (arr.length <= 1) {
            // Base case
            nodes[nodeIndex].status = 'sorted';
            addStep('DONE', `Base case reached for [${arr.join(', ')}]`, nodeId);
            recursionStack.pop();
            return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const leftArr = arr.slice(0, mid);
        const rightArr = arr.slice(mid);

        // Highlight before splitting
        addStep('HIGHLIGHT', `Dividing [${arr.join(', ')}] at index ${mid}`, nodeId);

        // Create children IDs
        const leftId = `${nodeId}-L`;
        const rightId = `${nodeId}-R`;

        // Update tree structure
        nodes[nodeIndex].children = [leftId, rightId];
        nodes[nodeIndex].status = 'splitting';

        // Add children to nodes list
        nodes.push({
            id: leftId,
            values: [...leftArr],
            level: node.level + 1,
            status: 'inactive',
            parentId: nodeId,
            children: []
        });
        nodes.push({
            id: rightId,
            values: [...rightArr],
            level: node.level + 1,
            status: 'inactive',
            parentId: nodeId,
            children: []
        });

        addStep('SPLIT', `Splitting [${arr.join(', ')}] into [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`, nodeId);

        // Recurse Left
        recursionStack.push(`mergeSort([${leftArr.join(', ')}])`);
        const sortedLeft = mergeSortRecursive(leftId);

        // Recurse Right
        recursionStack.push(`mergeSort([${rightArr.join(', ')}])`);
        const sortedRight = mergeSortRecursive(rightId);

        // Merge Phase
        nodes = nodes.map(n => ({
            ...n,
            status: n.id === nodeId ? 'merging' : (n.status === 'sorted' ? 'sorted' : 'inactive')
        }));

        addStep('MERGE', `Merging [${sortedLeft.join(', ')}] and [${sortedRight.join(', ')}]`, nodeId);

        // Perform merge
        const merged: number[] = [];
        let i = 0, j = 0;

        // We can animate the merge step-by-step here if we want detailed "comparing" steps
        while (i < sortedLeft.length && j < sortedRight.length) {
            addStep('COMPARE', `Comparing ${sortedLeft[i]} and ${sortedRight[j]}`, nodeId);
            if (sortedLeft[i] <= sortedRight[j]) {
                merged.push(sortedLeft[i]);
                i++;
            } else {
                merged.push(sortedRight[j]);
                j++;
            }
            // Update the values in the parent node progressively to show them filling in
            nodes = nodes.map(n => n.id === nodeId ? { ...n, values: [...merged] } : n);
            addStep('SET', `Placed ${merged[merged.length - 1]} into merged array`, nodeId);
        }

        while (i < sortedLeft.length) {
            merged.push(sortedLeft[i]);
            // nodes = nodes.map(n => n.id === nodeId ? { ...n, values: [...merged] } : n);
            // addStep('SET', `Taking remaining ${sortedLeft[i]} from left`, nodeId);
            i++;
        }

        while (j < sortedRight.length) {
            merged.push(sortedRight[j]);
            // nodes = nodes.map(n => n.id === nodeId ? { ...n, values: [...merged] } : n);
            // addStep('SET', `Taking remaining ${sortedRight[j]} from right`, nodeId);
            j++;
        }

        // Finalize node state
        nodes = nodes.map(n => n.id === nodeId ? { ...n, values: [...merged], status: 'sorted' } : n);

        // Remove children to clean up tree? Or keep them to show the history?
        // For visual, keeping them simplifies the structure, but we might want to fade them out.
        // Let's keep them but maybe mark them as merged-from.

        addStep('HIGHLIGHT', `Merged result: [${merged.join(', ')}]`, nodeId);
        recursionStack.pop();
        return merged;
    };

    mergeSortRecursive('root');

    addStep('DONE', 'Merge Sort Completed!', 'root');

    return { steps };
};
