/*
 * Copyright (c) 2020-2022 - for information on the respective copyright owner
 * see the NOTICE file and/or the repository at
 * https://github.com/hyperledger-labs/business-partner-agent
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { IStateSchemas } from "@/store/state-type";
import { CredentialTypes } from "@/constants";
import adminService from "@/services/admin-service";
import { EventBus } from "@/main";
import { SchemaApi } from "@/services";

const state: IStateSchemas = {
  schemas: new Array<SchemaApi>(),
};

export default {
  state,
  getters: {
    getSchemas: (state: IStateSchemas) => {
      return state.schemas;
    },
    getSchemaBasedSchemas: (state: IStateSchemas) => {
      return state.schemas.filter((schema) => {
        return (
          schema.type === CredentialTypes.INDY.type ||
          schema.type === CredentialTypes.JSON_LD.type
        );
      });
    },
    getSchemaById: (state: IStateSchemas) => (schemaId) => {
      if (!schemaId) {
        return;
      }
      return state.schemas.find((schema) => {
        return schema.schemaId === schemaId;
      });
    },
    getSchemaByType: (state: IStateSchemas) => (schemaType) => {
      if (!schemaType) {
        return;
      }
      return state.schemas.find((schema) => {
        return schema.type === schemaType;
      });
    },
  },
  actions: {
    async loadSchemas(context: any) {
      adminService
        .listSchemas()
        .then((result) => {
          if (result.status === 200) {
            context.commit("setSchemas", result.data);
          }
        })
        .catch((error) => {
          console.error(error);
          EventBus.$emit("error", error);
        });
    },
  },
  mutations: {
    setSchemas: (state: IStateSchemas, schemas: SchemaApi[]) => {
      state.schemas = schemas;
    },
  },
};
