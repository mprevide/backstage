/* eslint-disable security/detect-object-injection */
/* eslint-disable no-case-declarations */
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const {
  Logger,
} = require('@dojot/microservice-sdk');
// const Keycloak = require('../../keycloak');

const logger = new Logger('backstage:graphql/device/Resolvers');
const UTIL = require('../utils/AxiosUtils');

const {
  reduceList,
  convertList,
  formatValueType,
  formatOutPut,
  getDevices,
  getHistory,
  getStaticAttributes,
  getDevicesByTemplate,
  OPERATION,
  SOURCE,
<<<<<<< HEAD:app/graphql/device/Resolvers.js
  WIDGET_TYPE,
=======
  WIDGET_TYPE
>>>>>>> cddf626fe1a96791c9fcb83acbe7534150c6e976:src/graphql/device/Resolvers.js
} = require('./Helpers');

const paramsAxios = {
  token: null,
};
const setToken = ((token) => {
  paramsAxios.token = token;
});
const optionsAxios = ((method, url) => UTIL.optionsAxios(method, url, paramsAxios.token));

const Resolvers = {
  Query: {
    async getDeviceById(root, { deviceId }, context) {
      setToken(context.token);
      const device = {};

      try {
        const { data: deviceData } = await axios(optionsAxios(UTIL.GET, `/device/${deviceId}`));
        device.id = deviceData.id;
        device.label = deviceData.label;
        device.attrs = [];
        Object.keys(deviceData.attrs).forEach((key) => {
          deviceData.attrs[key].forEach((attr) => {
            if (attr.type !== 'dynamic') {
              return;
            }
            device.attrs.push({
              label: attr.label,
              valueType: formatValueType(attr.value_type),
              isDynamic: attr.type === 'dynamic',
              staticValue: attr.static_value,
            });
          });
        });
        return (device);
      } catch (error) {
        logger.error(error.stack || error);
        throw error;
      }
    },

    async getDevices(root, params, context) {
      setToken(context.token);
      // building the request string
      try {
        const requestParameters = {};

        if (params.page) {
          if (params.page.size) {
            requestParameters.page_size = params.page.size;
          } else {
            requestParameters.page_size = 20;
          }
          if (params.page.number) {
            requestParameters.page_num = params.page.number;
          } else {
            requestParameters.page_num = 1;
          }
        }

        if (params.filter) {
          if (params.filter.label) {
            requestParameters.label = params.filter.label;
          }
        }

        requestParameters.sortBy = params.sortBy || 'label';

        let requestString = '/device?';
        const keys = Object.keys(requestParameters);
        const last = keys[keys.length - 1];
        keys.forEach((element) => {
          if (element === last) {
            requestString += `${element}=${requestParameters[element]}`;
          } else {
            requestString += `${element}=${requestParameters[element]}&`;
          }
        });

        const { data: fetchedData } = await axios(optionsAxios(UTIL.GET, requestString));
        const devices = [];

        fetchedData.devices.forEach((device) => {
          const attributes = [];
          if (device.attrs) {
            Object.keys(device.attrs).forEach((key) => {
              device.attrs[key].forEach((attr) => {
                if (attr.type !== 'dynamic' && attr.value_type !== 'geo:point') {
                  return;
                }
                attributes.push({
                  label: attr.label,
                  valueType: formatValueType(attr.value_type),
                  isDynamic: attr.type === 'dynamic',
                  staticValue: attr.static_value,
                });
              });
            });
          }
          devices.push({
            id: device.id,
            label: device.label,
            attrs: attributes,
          });
        });

        return ({
          totalPages: fetchedData.pagination.total,
          currentPage: fetchedData.pagination.page,
          devices,
        });
      } catch (error) {
        logger.error(error.stack || error);
        throw error;
      }
    },

    async getDeviceHistoryForDashboard(
      root,
      props,
      context,
    ) {
      setToken(context.token);
      const {
<<<<<<< HEAD:app/graphql/device/Resolvers.js
        filter: {
          dateFrom = '', dateTo = '', lastN = '1', devices = [], templates = [],
        },
        configs: {
          sourceType = SOURCE.DEVICE,
          operationType = OPERATION.LAST.N,
          widgetType = WIDGET_TYPE.DEFAULT,
        },
=======
        filter: { dateFrom = '', dateTo = '', lastN = '1', devices = [], templates = [] },
        configs: { sourceType = SOURCE.DEVICE, operationType = OPERATION.LAST.N, widgetType = WIDGET_TYPE.DEFAULT }
>>>>>>> cddf626fe1a96791c9fcb83acbe7534150c6e976:src/graphql/device/Resolvers.js
      } = props;
      let sortedHistory = [];
      let queryStringParams = '';
      let dynamicAttrs = [];
      let staticAttrs = [];
      let dojotDevices = {};
      let devicesFromTemplate = [];
      let deviceDictionary = {};

<<<<<<< HEAD:app/graphql/device/Resolvers.js
      switch (operationType) {
=======
      switch( operationType ) {
>>>>>>> cddf626fe1a96791c9fcb83acbe7534150c6e976:src/graphql/device/Resolvers.js
        case OPERATION.LAST.N:
          // To get the latest N records
          queryStringParams += `${lastN && `&lastN=${lastN}`}`;
          break;
        case OPERATION.LAST.MINUTES:
          // To get the data for the last minutes
          queryStringParams += `&dateFrom=${moment().subtract(lastN, 'minute').toISOString()}`;
          break;
        case OPERATION.LAST.HOURS:
          // To get the data for the last hours
          queryStringParams += `&dateFrom=${moment().subtract(lastN, 'hour').toISOString()}`;
          break;
        case OPERATION.LAST.DAYS:
          // To get the data for the last days
          queryStringParams += `&dateFrom=${moment().subtract(lastN, 'days').toISOString()}`;
          break;
        case OPERATION.LAST.MOUTHS:
          // To get the data for the last months
          queryStringParams += `&dateFrom=${moment().subtract(lastN, 'month').toISOString()}`;
          break;
        default:
          // Standard option is to get data by time window
          queryStringParams = `${dateFrom && `&dateFrom=${dateFrom}`}${dateTo && `&dateTo=${dateTo}`}`;
          break;
      }
      try {
<<<<<<< HEAD:app/graphql/device/Resolvers.js
        switch (sourceType) {
          case SOURCE.DEVICE:
            const devicesIds = devices.map((device) => device.deviceID);
            dojotDevices = await getDevices(devicesIds, optionsAxios);
            dynamicAttrs = await getHistory(devices, optionsAxios, queryStringParams);
            break;
          case SOURCE.TEMPLATE:
            const ret = await getDevicesByTemplate(templates, optionsAxios);
=======
        switch( sourceType ) {
          case SOURCE.DEVICE:
            const devicesIds = devices.map(device => device.deviceID)
            dojotDevices = await getDevices(devicesIds, optionsAxios)
            dynamicAttrs = await getHistory(devices, optionsAxios, queryStringParams)
            break;
          case SOURCE.TEMPLATE:
            const ret = await getDevicesByTemplate(templates, optionsAxios)
>>>>>>> cddf626fe1a96791c9fcb83acbe7534150c6e976:src/graphql/device/Resolvers.js
            dojotDevices = ret.values;
            devicesFromTemplate = ret.devicesIDs;
            deviceDictionary = ret.deviceDictionary;
            dynamicAttrs = await getHistory(devicesFromTemplate, optionsAxios, queryStringParams);
            break;
          default:
            dojotDevices = {};
            break;
        }

<<<<<<< HEAD:app/graphql/device/Resolvers.js
        if (widgetType === WIDGET_TYPE.MAP || widgetType === WIDGET_TYPE.TABLE) {
          if (sourceType === SOURCE.DEVICE) {
            staticAttrs = getStaticAttributes(dojotDevices, devices);
          }
          if (sourceType === SOURCE.TEMPLATE) {
            staticAttrs = getStaticAttributes(dojotDevices, devicesFromTemplate);
=======
        if( widgetType === WIDGET_TYPE.MAP || widgetType === WIDGET_TYPE.TABLE ) {
          if( sourceType === SOURCE.DEVICE ) {
            staticAttrs = getStaticAttributes(dojotDevices, devices)
          }
          if( sourceType === SOURCE.TEMPLATE ) {
            staticAttrs = getStaticAttributes(dojotDevices, devicesFromTemplate)
>>>>>>> cddf626fe1a96791c9fcb83acbe7534150c6e976:src/graphql/device/Resolvers.js
          }
        }
      } catch (error) {
        logger.error(error.stack || error);
        throw error;
      }

<<<<<<< HEAD:app/graphql/device/Resolvers.js
      const {
        history,
        historyObj,
      } = formatOutPut(
        dynamicAttrs,
        staticAttrs, dojotDevices,
        deviceDictionary,
        sourceType,
        widgetType,
      );

      if (widgetType === WIDGET_TYPE.MAP) {
=======
      const { history, historyObj } = formatOutPut(dynamicAttrs, staticAttrs, dojotDevices, deviceDictionary, sourceType, widgetType);

      if( widgetType === WIDGET_TYPE.MAP ) {
>>>>>>> cddf626fe1a96791c9fcb83acbe7534150c6e976:src/graphql/device/Resolvers.js
        return JSON.stringify(historyObj);
      }

      sortedHistory = _.orderBy(history, (o) => moment(o.timestamp).format('YYYYMMDDHHmmss'), ['asc']);

      return JSON.stringify(reduceList(convertList(sortedHistory)));
    },
  },
};


module.exports = Resolvers;
