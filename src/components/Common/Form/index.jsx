import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from '../../Forms/input';
import Select from '../../Forms/select';
import './formStyles.css';

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  getTranslatedField = field => this.props.t(`forms.fields.${field}`);

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = this.props
        .t(`forms.validations.${item.type}`)
        .replace('{$name}', item.path[0]);
    }
    return errors;
  };
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    if (error) {
      const { path, type } = error.details[0];
      return this.props
        .t(`forms.validations.${type}`)
        .replace('{$name}', this.getTranslatedField(path[0]));
    }
  };
  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };
  renderButton(label) {
    return (
      <button disabled={this.validate()} className='btn btn-primary'>
        {label}
      </button>
    );
  }
  renderInput(name, label, type = 'text') {
    const { data, errors } = this.state;

    let onKeyPress;

    if (type === 'email') {
      onKeyPress = e => {
        const code = e.which;
        if (code === 32) {
          e.preventDefault();
        }
      };
    }

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        error={errors[name]}
        onChange={this.handleChange}
        onKeyPress={onKeyPress}
      />
    );
  }
  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
