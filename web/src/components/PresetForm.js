import React from 'react';
import {FormGroup, FormControl, Col, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {Form, Control, actions} from 'react-redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../actionCreators';

let PresetForm = (props) => {
  console.log("PresetForm", props);
  if (props.params.presetName) {
    if ((!props.preset) || (props.preset.name != props.params.presetName)) {
      console.log("[PresetForm] finding preset ", props.params.presetName);
      const idx = props.presets.findIndex((preset) => preset.name === props.params.presetName);
      console.log("Preset found at index ", idx);
      const p = Object.assign({}, props.presets[idx], {});
      props.selectPreset(p);
    }
  }
  return (
    <Form model="preset" horizontal>
      <FormGroup controlId="presetName">
        <Col componentClass={ControlLabel} sm={2}>
          Name
        </Col>
        <Col sm={10}>
          <Control.text
            model="preset.name"
            component={FormControl}
            placeholder="Preset's name"
          />
        </Col>
      </FormGroup>
      <FormGroup controlId="presetValue">
        <Col componentClass={ControlLabel} sm={2}>
          Value
        </Col>
        <Col sm={10}>
          <Control.text
            model="preset.value"
            component={FormControl}
            placeholder="Preset's value"
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col smOffset={2} sm={10}>
          <ControlLabel>
            Enabled
            <Control.checkbox
              model="preset.enabled"
              component={Checkbox}
            />
          </ControlLabel>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col smOffset={2} sm={10}>
          <Button type="submit">Save</Button>
          &nbsp;
          <LinkContainer to="/">
            <Button className="btn-primary">Cancel</Button>
          </LinkContainer>
        </Col>
      </FormGroup>
    </Form>
  );
}

function mapStateToProps(state) {
  return {
    presets: state.presets,
    preset: state.preset
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

PresetForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(PresetForm);

export default PresetForm;
