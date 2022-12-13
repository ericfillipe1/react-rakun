import { RakunMono, Void } from "rakun";
export type Resetter = () => void;
export type SetterOrUpdater<T> = (valOrUpdater: ((currVal: T) => T) | T) => void;


interface ValueLoadable<T> {
    state: 'hasValue';
    contents: T;
}

interface LoadingLoadable<T> {
    state: 'loading';
    contents: Promise<T>;
}

interface ErrorLoadable {
    state: 'hasError';
    contents: any;
}

export type Loadable<T> =
    | ValueLoadable<T>
    | LoadingLoadable<T>
    | ErrorLoadable;



export type RakunRootContext = RakunMono<typeof Void>
export type RakunRootProps = {
    value: RakunMono<any>
    children: React.ReactNode,
} 
