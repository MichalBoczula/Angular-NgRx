import { createAction, createReducer, on } from "@ngrx/store";

export const productReducer = createReducer(
    {
        showProductCode: true
    },
    on(createAction('toggleShowProductCode'), state => {
        return {
            ...state,
            showProductCode: !state.showProductCode
        }
    })
);