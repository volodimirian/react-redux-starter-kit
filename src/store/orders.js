import browserHistory from 'react-router/lib/browserHistory'

// ------------------------------------
// Constants
// ------------------------------------
export const SAVE_ORDERS = 'SAVE_ORDERS'

// ------------------------------------
// Actions
// ------------------------------------
export function saveOrders(data) {
    console.log('call reducer >>> ', data)
    return {
        type: SAVE_ORDERS,
        payload: data
    }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
/* export const updateLocation = ({ dispatch }) => {
    return (nextLocation) => dispatch(locationChange(nextLocation))
} */

// ------------------------------------
// Reducer
// ------------------------------------
export default function ordersReducer(state = {}, action) {
    return action.type === SAVE_ORDERS
        ? action.payload
        : state
}
