import { RakunFlux, RakunMono, WrappedValue_OPAQUE } from "rakun"
import { useCallback, useContext, useMemo, useState } from "react"
import { RakunSnapshotContext } from "./root"
import { Loadable } from "./types"

type UseRakunValueLoadable = {
    <T>(rakunSource: RakunMono<T>): Loadable<T>
    <T>(rakunSource: RakunFlux<T>): Loadable<T[]>

}
export const useRakunValueLoadable: UseRakunValueLoadable = (rakunSource) => {
    const context = useContext(RakunSnapshotContext)
    let setValueLoadable = (_: any) => { }
    const load = useCallback(() => {
        if (rakunSource[WrappedValue_OPAQUE] == 'flux') {
            return context.then(rakunSource)
                .array()
                .doOnNext(contents => setValueLoadable({
                    state: "hasValue",
                    contents: contents
                }))
                .doOnError(contents => setValueLoadable({
                    state: "hasError",
                    contents: contents
                }))
                .blockFirst();

        } else {
            return context.then(rakunSource)
                .doOnNext(contents => setValueLoadable({
                    state: "hasValue",
                    contents: contents
                }))
                .doOnError(contents => setValueLoadable({
                    state: "hasError",
                    contents: contents
                }))
                .blockFirst();

        }

    }, []);
    const [valueLoadable, _setValueLoadable] = useState<Loadable<any>>(() => ({
        state: 'loading',
        contents: load(),
    }))
    setValueLoadable = _setValueLoadable
    return valueLoadable;
}



type UseRakun = {
    <T>(rakunMono: RakunMono<T>): RakunMono<T>
    <T>(rakunFlux: RakunFlux<T>): RakunFlux<T>

}
export const useRakun: UseRakun = (rakunSource) => {
    const context = useContext(RakunSnapshotContext)
    return useMemo<any>(() => {
        if (rakunSource[WrappedValue_OPAQUE] == 'flux') {
            return context.then(rakunSource);
        } else {
            return context.then(rakunSource);
        }
    }, [rakunSource]);
}
type UseRakunCallback = {
    <Args extends ReadonlyArray<unknown>, Source extends (RakunFlux<any> | RakunMono<any>)>(fn: (...args: Args) => Source): (...args: Args) => Source
}

export const useRakunCallback: UseRakunCallback = (fn) => {
    const context = useContext(RakunSnapshotContext)
    return useCallback((...args: any) => {
        return context.then(fn(...args));
    }, []);
}

type UseZoldyValue = {
    <T>(rakunSource: RakunMono<T>): T
    <T>(rakunSource: RakunFlux<T>): T[]
}

export const useZoldyValue: UseZoldyValue = (rakunSource) => {
    const valueLoadable = useRakunValueLoadable(rakunSource as any);
    if (valueLoadable.state == "hasError")
        throw valueLoadable.contents
    else if (valueLoadable.state == "loading")
        throw valueLoadable.contents
    else
        throw valueLoadable.contents
}
