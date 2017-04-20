import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableHighlight, ActivityIndicator, Picker } from 'react-native'
import { connect } from 'react-redux'
import { initialiseForm, setFieldValue, setFieldError, setFieldErrors, setDirty, setSubmitting, submitSuccess, submitFailure, removeForm } from './actions'
import { getError } from './selectors'
import styles from './styles'

@connect(
   (state, ownProps) => ({
      values: state.getIn([ 'forms', ownProps.formName, 'values' ]),
      errors: state.getIn([ 'forms', ownProps.formName, 'errors' ]),
      isDirty: state.getIn([ 'forms', ownProps.formName, 'isDirty' ]),
      isSubmitting: state.getIn([ 'forms', ownProps.formName, 'isSubmitting' ]),
   }),
   (dispatch, ownProps) => ({
      onLoad: () => dispatch(initialiseForm(ownProps.formName)),
      setFieldError: (fieldName, err) => dispatch(setFieldError(ownProps.formName, fieldName, err)),
      setDirty: () => dispatch(setDirty(ownProps.formName)),
      setSubmitting: (isSubmitting) => dispatch(setSubmitting(ownProps.formName, isSubmitting)),
      removeForm: () => dispatch(removeForm(ownProps.formName)),
   })
)
export class Form extends Component {
   constructor(props) {
      super(props)
      this.props.onLoad()
      this.submit = this.submit.bind(this)
      this._children = React.Children.map(this.props.children, child => {
         // TODO: this should probably detect whether they type is one of our field types or A DERIVITIVE THEREOF
         return React.cloneElement(child, {
            formName: this.props.formName
         })
      })
   }
   componentWillReceiveProps(nextProps) {
      if(!this.props.isSubmitting && nextProps.isSubmitting) {
         this.submit()
      }
   }
   componentWillUnmount() {
      if(!this.props.persist) {
         this.props.removeForm()
      }
   }
   submit() {
      this.props.setDirty()
      if(this.props.errors.filter(v => v).count() === 0) {
         this.props.onSubmit(this.props.values && this.props.values.toJS())
      } else {
         this.props.setSubmitting(false)
         if(this.props.onValidationFailure) this.props.onValidationFailure(this.props.errors)
      }
   }
   render() {
      return (
         <View {...this.props} style={[ styles.form, this.props.style ]} >
            {this._children}
         </View>
      )
   }
}

/**
* Text Input field
*/
@connect(
   (state, ownProps) => ({
      value: state.getIn([ 'forms', ownProps.formName, 'values', ownProps.name ]),
      error: state.getIn([ 'forms', ownProps.formName, 'errors', ownProps.name ]),
      isDirty: state.getIn([ 'forms', ownProps.formName, 'isDirty' ]),
      isSubmitting: state.getIn([ 'forms', ownProps.formName, 'isSubmitting' ]),
   }),
   (dispatch, ownProps) => ({
      setFieldValue: (val) => dispatch(setFieldValue(ownProps.formName, ownProps.name, val)),
      setFieldError: (err) => dispatch(setFieldError(ownProps.formName, ownProps.name, err)),
   })
)
export class TextField extends Component {
   constructor(props) {
      super(props)
      this.setFieldValue = this.setFieldValue.bind(this)
      this.setFieldValue(this.props.value || this.props.defaultValue)
   }
   setFieldValue(val) {
      this.props.setFieldValue(val)
      let err = this.props.getValidationError(val)
      this.props.setFieldError(err)
   }
   render() {
      if(this.props.renderField) {
         return this.props.renderField({...this.props, setFieldValue: this.setFieldValue})
      }
      return (
         <View style={styles.textFieldWrapper}>
            <Text style={styles.textFieldLabel}>{this.props.label}</Text>
            <TextInput
               {...this.props}
               style={
                  this.props.isSubmitting
                     ? [ styles.textField, styles.textFieldSubmitting, this.props.submittingStyle ]
                     : this.props.isDirty && this.props.error
                        ? [ styles.textField, styles.textFieldError, this.props.errorStyle ]
                        : [ styles.textField, this.props.style ]
               }
               defaultValue={this.props.defaultValue}
               onChangeText={this.setFieldValue}
               underlineColorAndroid="transparent"
            />
            { this.props.isDirty && this.props.error
               ? <Text style={styles.textFieldErrorMessage}>{this.props.error}</Text>
               : null }
         </View>
      )
   }
}

/**
 * Email Address field
 */
export class EmailAddress extends Component {
   constructor(props) {
      super(props)
   }
   static emailAddressRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   getValidationError(value) {
      return value && EmailAddress.emailAddressRegex.test(value)
         ? null
         : 'Email address is invalid'
   }
   render() {
      return (
         <TextField
            name="email"
            label="Email Address"
            getValidationError={this.getValidationError}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            {...this.props}
         />
      )
   }
}

/**
 * Password field
 */
export class Password extends Component {
   constructor(props) {
      super(props)
   }
   getValidationError(value) {
      return value && value.length >= 6
         ? null
         : 'Password should be 6 characters or more'
   }
   render() {
      return (
         <TextField
            name="password"
            label="Password"
            getValidationError={this.getValidationError}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            {...this.props}
         />
      )
   }
}

/**
 * Picker
 */
@connect(
   (state, ownProps) => ({
      value: state.getIn([ 'forms', ownProps.formName, 'values', ownProps.name ]),
      error: state.getIn([ 'forms', ownProps.formName, 'errors', ownProps.name ]),
      isDirty: state.getIn([ 'forms', ownProps.formName, 'isDirty' ]),
      isSubmitting: state.getIn([ 'forms', ownProps.formName, 'isSubmitting' ]),
   }),
   (dispatch, ownProps) => ({
      setFieldValue: (val) => dispatch(setFieldValue(ownProps.formName, ownProps.name, val)),
      setFieldError: (err) => dispatch(setFieldError(ownProps.formName, ownProps.name, err)),
   })
)
export class PickerField extends Component {
   constructor(props) {
      super(props)
      this.setFieldValue = this.setFieldValue.bind(this)
      this.getValidationError = this.getValidationError.bind(this)
      this.setFieldValue(this.props.value || this.props.defaultValue)
   }
   getValidationError(value) {
      return null
   }
   setFieldValue(val) {
      this.props.setFieldValue(val)
      let err = this.getValidationError(val)
      this.props.setFieldError(err)
   }
   render() {
      // if(this.props.renderField) {
      //    return this.props.renderField({...this.props, setFieldValue: this.setFieldValue})
      // }
      return (
         <Picker
            selectedValue="js"
            onValueChange={(lang) => this.setState({language: lang})}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
         </Picker>
      )
   }
}

/**
 * Radio buttons
 */
@connect(
   (state, ownProps) => ({
      value: state.getIn([ 'forms', ownProps.formName, 'values', ownProps.name ]),
      error: state.getIn([ 'forms', ownProps.formName, 'errors', ownProps.name ]),
      isDirty: state.getIn([ 'forms', ownProps.formName, 'isDirty' ]),
      isSubmitting: state.getIn([ 'forms', ownProps.formName, 'isSubmitting' ]),
   }),
   (dispatch, ownProps) => ({
      setFieldValue: (val) => dispatch(setFieldValue(ownProps.formName, ownProps.name, val)),
      setFieldError: (err) => dispatch(setFieldError(ownProps.formName, ownProps.name, err)),
   })
)
export class RadioButtons extends Component {
   constructor(props) {
      super(props)
      this.setFieldValue = this.setFieldValue.bind(this)
      this.getValidationError = this.getValidationError.bind(this)
      this.setFieldValue(this.props.value || this.props.defaultValue)
   }
   getValidationError(value) {
      return null
   }
   setFieldValue(val) {
      this.props.setFieldValue(val)
      let err = this.getValidationError(val)
      this.props.setFieldError(err)
   }
   render() {
      // if(this.props.renderField) {
      //    return this.props.renderField({...this.props, setFieldValue: this.setFieldValue})
      // }
      return (
         <View style={{ flexDirection: 'row' }}>
            { React.Children.map(this.props.children, child => {
               return React.cloneElement(child, {
                  onPress: () => this.setFieldValue(child.props.value),
                  isSelected: this.props.value === child.props.value
               })
            }) }
         </View>
      )
   }
}
RadioButtons.Option = ({ value, label, onPress, isSelected }) => (
   <TouchableHighlight
      activeOpacity={0.7}
      underlayColor="black"
      onPress={onPress}
      style={[{ flex: 1, height: 40, justifyContent: 'center', alignItems: 'stretch' }]}
   >
      <View
         style={[{ flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }, isSelected ? { backgroundColor: 'red' } : null ]}
      >
         <Text>{label}</Text>
      </View>
   </TouchableHighlight>
)

/**
 * Submit button
 */
@connect(
   (state, ownProps) => ({
      isSubmitting: state.getIn([ 'forms', ownProps.formName, 'isSubmitting' ]),
   }),
   (dispatch, ownProps) => ({
      submit: () => dispatch(setSubmitting(ownProps.formName, true)),
   })
)
export class Submit extends Component {
   render() {
      return (
         <TouchableOpacity
            style={[ styles.submit, this.props.style ]}
            onPress={this.props.submit}
            >
            { this.props.isSubmitting
               ? <ActivityIndicator color={this.props.color}/>
               : <Text style={[ styles.submitText, this.props.textStyle ]}>{ this.props.title || 'Submit' }</Text> }
         </TouchableOpacity>
      )
   }
}

/**
 * Creates a form and ties to a key for use in the store.
 */
export function createForm(formName) {
   class FormWrapper extends Component {
      render() {
         return <Form {...this.props} formName={formName}/>
      }
   }
   FormWrapper.submitSuccess = (...args) => submitSuccess(formName, ...args)
   FormWrapper.submitFailure = (...args) => submitFailure(formName, ...args)
   FormWrapper.setFieldError = (...args) => setFieldError(formName, ...args)
   FormWrapper.setFieldErrors = (...args) => setFieldErrors(formName, ...args)
   FormWrapper.getError = (state, fieldName) => getError(state, formName, fieldName)
   return FormWrapper
}
