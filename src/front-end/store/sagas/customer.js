import { put } from 'redux-saga/effects';

import { Creators as CustomerCreators } from '../ducks/customer';

import {
  CREATE,
  READ,
  UPDATE,
  DELETE,
} from '../../../back-end/events-handlers/customer/types';

import { handleEventUnsubscription, handleEventSubscription } from './eventHandler';
import { OPERATION_REQUEST, CUSTOMER } from '../../../common/entitiesTypes';

const { ipcRenderer } = window.require('electron');

const EVENT_TAGS = {
  READ_ALL: 'CUSTOMERS_READ_ALL',
  CREATE_CUSTOMER: 'CUSTOMER_CREATE',
  UPDATE_CUSTOMER: 'CUSTOMER_UPDATE',
  REMOVE_CUSTOMER: 'CUSTOMER_REMOVE',
};

export function* createCustomer(action) {
  try {
    const { args } = action;

    ipcRenderer.send(OPERATION_REQUEST, CUSTOMER, CREATE, EVENT_TAGS.CREATE_CUSTOMER, args);
    const { result } = yield handleEventSubscription(EVENT_TAGS.CREATE_CUSTOMER);
    handleEventUnsubscription(EVENT_TAGS.CREATE_CUSTOMER);

    const newCustomer = {
      ...args,
      id: result,
    };

    yield put(CustomerCreators.createCustomerSuccess(newCustomer));
  } catch (err) {
    yield put(CustomerCreators.createCustomerFailure(err.message));
  }
}

export function* getAllCustomers() {
  try {
    ipcRenderer.send(OPERATION_REQUEST, CUSTOMER, READ, EVENT_TAGS.READ_ALL);
    const { result } = yield handleEventSubscription(EVENT_TAGS.READ_ALL);
    handleEventUnsubscription(EVENT_TAGS.READ_ALL);

    yield put(CustomerCreators.getAllCustomersSuccess(result));
  } catch (err) {
    yield put(CustomerCreators.getAllCustomersFailure(err.message));
  }
}

export function* editCustomer(action) {
  try {
    const { customer } = action.payload;

    ipcRenderer.send(OPERATION_REQUEST, CUSTOMER, UPDATE, EVENT_TAGS.UPDATE_CUSTOMER, customer);
    const { result } = yield handleEventSubscription(EVENT_TAGS.UPDATE_CUSTOMER);
    handleEventUnsubscription(EVENT_TAGS.UPDATE_CUSTOMER);

    yield put(CustomerCreators.editCustomerSuccess(result));
  } catch (err) {
    yield put(CustomerCreators.editCustomerFailure(err.message));
  }
}

export function* removeCustomer(action) {
  try {
    const { id } = action.payload;

    ipcRenderer.send(OPERATION_REQUEST, CUSTOMER, DELETE, EVENT_TAGS.REMOVE_CUSTOMER, id);
    yield handleEventSubscription(EVENT_TAGS.REMOVE_CUSTOMER);
    handleEventUnsubscription(EVENT_TAGS.REMOVE_CUSTOMER);

    yield put(CustomerCreators.removeCustomerSuccess(id));
  } catch (err) {
    yield put(CustomerCreators.removeCustomerFailure(err.message));
  }
}