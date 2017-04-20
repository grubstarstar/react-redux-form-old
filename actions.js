export const SET_FIELD_VALUE = 'SET_FIELD_VALUE'
export const SET_FIELD_ERROR = 'SET_FIELD_ERROR'
export const INITIALISE_FORM = 'INITIALISE_FORM'
export const SET_DIRTY = 'SET_DIRTY'
export const SET_SUBMITTING = 'SET_SUBMITTING'
export const REMOVE_FORM = 'REMOVE_FORM'

export const initialiseForm = (formName) => ({
   type: INITIALISE_FORM,
   formName
})

export const setFieldValue = (formName, fieldName, fieldValue) => ({
   type: SET_FIELD_VALUE,
   formName,
   fieldName,
   fieldValue
})

export const setFieldError = (formName, fieldName, fieldError) => ({
   type: SET_FIELD_ERROR,
   formName,
   fieldName,
   fieldError
})

export const setFieldErrors = (formName, fieldErrors) => {
   return (dispatch) => {
      fieldErrors.forEach((err, fieldName) => {
         dispatch(setFieldError(formName, fieldName, err))
      })
   }
}

export const setDirty = (formName) => ({
   type: SET_DIRTY,
   formName
})

export const setSubmitting = (formName, isSubmitting) => ({
   type: SET_SUBMITTING,
   formName,
   isSubmitting
})

export const submitSuccess = (formName) => {
   return (dispatch) => {
		dispatch(setSubmitting(formName, false))
	}
}

export const submitFailure = (formName, fieldErrors) => {
   return (dispatch) => {
      dispatch(setFieldErrors(formName, fieldErrors))
      dispatch(setSubmitting(formName, false))
   }
}

export const removeForm = (formName) => ({
   type: REMOVE_FORM,
   formName
})
