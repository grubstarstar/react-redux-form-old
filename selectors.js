export const getError = (state, formName, fieldName) =>
   state.getIn([ 'forms', formName, 'isDirty' ])
   && state.getIn([ 'forms', formName, 'errors', fieldName ])
