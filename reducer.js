import { Map, fromJS } from 'immutable'
import { INITIALISE_FORM, SET_FIELD_VALUE, SET_FIELD_ERROR, SET_SUBMITTING, SET_DIRTY, REMOVE_FORM } from './actions'

const initialState = fromJS({})

export const reducer = (state = initialState, action) => {
   switch(action.type) {
      case INITIALISE_FORM:
         return state.set(action.formName, fromJS({
            values: {},
            errors: {},
            isDirty: false,
            isSubmitting: false
         }))
      case SET_FIELD_VALUE:
         return state.setIn([ action.formName, 'values', action.fieldName ], action.fieldValue)
      case SET_FIELD_ERROR:
         return state.setIn([ action.formName, 'errors', action.fieldName ], action.fieldError)
      case SET_DIRTY:
         return state.setIn([ action.formName, 'isDirty' ], true)
      case SET_SUBMITTING:
         return state.setIn([ action.formName, 'isSubmitting' ], action.isSubmitting)
      case REMOVE_FORM:
         return state.delete(action.formName)
      default:
         return state
   }
}
