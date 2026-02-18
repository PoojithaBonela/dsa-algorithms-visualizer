export type TraceAction = 'COMPARE' | 'SWAP' | 'SET' | 'HIGHLIGHT' | 'DONE' | 'SPLIT' | 'MERGE';

export interface MergeNode {
    id: string;
    values: number[];
    level: number;
    // active: currently processing, sorted: finished, splitting: animation state, merging: animation state
    status: 'active' | 'inactive' | 'sorted' | 'splitting' | 'merging';
    parentId?: string;
    children?: string[]; // IDs of children
}

export interface TraceStep {
    type: TraceAction;
    indices: number[];
    array: number[];
    nodes?: MergeNode[]; // Snapshot of the tree for Merge Sort
    recursionStack?: string[]; // Stack of function calls
    activeNodeId?: string; // ID of the node currently acting
    activeRange?: [number, number]; // [low, high] for searching range
    message: string;
}

export interface AlgorithmTrace {
    steps: TraceStep[];
}
