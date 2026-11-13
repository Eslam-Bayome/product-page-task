import {
  create,
  type Mutate,
  type StateCreator,
  type StoreApi,
  type UseBoundStore,
} from "zustand";
import { devtools, persist, type PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * The one-time setup. Write this file ONCE per project.
 *
 * Every store is created with `createStore` (or `createPersistedStore`) so you
 * never repeat `create()(devtools(persist(immer(...))))` again. Middleware order
 * follows the Zustand rule: `devtools` outermost, `immer` innermost.
 *
 * - devtools  → Redux DevTools, auto-disabled in production.
 * - immer     → mutate state directly in `set` (`s.items.push(x)`), no spreads.
 * - persist   → only on `createPersistedStore`; whitelist via `partialize`.
 */

const isDev = import.meta.env.DEV;

/* ---------------------------------------------------------------------------
 * Non-persisted store: devtools + immer. This is the default (~95% of stores).
 * ------------------------------------------------------------------------- */

type BaseMutators = [["zustand/devtools", never], ["zustand/immer", never]];

/** Type for a non-persisted store initializer. Gives a fully-typed immer `set`. */
export type StoreInitializer<T> = StateCreator<T, BaseMutators>;

export const createStore = <T>(
  name: string,
  initializer: StoreInitializer<T>,
): UseBoundStore<Mutate<StoreApi<T>, BaseMutators>> =>
  create<T>()(devtools(immer(initializer), { name, enabled: isDev }));

/* ---------------------------------------------------------------------------
 * Persisted store: devtools + persist + immer. Opt in only when state must
 * survive a reload. `partialize` is REQUIRED — whitelist exactly what persists.
 * ------------------------------------------------------------------------- */

// What the initializer/`persist` middleware expects: the persist slot is the
// conventional `unknown` marker.
type PersistedMutators = [
  ["zustand/devtools", never],
  ["zustand/persist", unknown],
  ["zustand/immer", never],
];

// What `persist` actually produces: the persist slot carries the persisted
// shape (`partialize` keeps `Partial<T>`). Used only for the return annotation.
type PersistedStore<T> = UseBoundStore<
  Mutate<
    StoreApi<T>,
    [
      ["zustand/devtools", never],
      ["zustand/persist", Partial<T>],
      ["zustand/immer", never],
    ]
  >
>;

/** Type for a persisted store initializer. Gives a fully-typed immer `set`. */
export type PersistedStoreInitializer<T> = StateCreator<T, PersistedMutators>;

type PersistedStoreOptions<T> = Pick<
  PersistOptions<T, Partial<T>>,
  "partialize"
> &
  Partial<
    Pick<PersistOptions<T, Partial<T>>, "version" | "migrate" | "storage">
  >;

export const createPersistedStore = <T>(
  name: string,
  initializer: PersistedStoreInitializer<T>,
  options: PersistedStoreOptions<T>,
): PersistedStore<T> =>
  create<T>()(
    devtools(persist(immer(initializer), { name, version: 1, ...options }), {
      name,
      enabled: isDev,
    }),
  );
