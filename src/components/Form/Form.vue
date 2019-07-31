<script src="./Form.js"></script>
<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card v-if="!!step" class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Processing...</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                {{ step }}
              </v-card-text>
              <v-card-text>
                <v-progress-linear indeterminate color="cyan"></v-progress-linear>
              </v-card-text>
            </v-card>

            <v-card v-else-if="!result" class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Send file</v-toolbar-title>
              </v-toolbar>
              <v-form ref="form" @submit="handleSubmit">
                <v-card-text>
                  <v-file-input
                    v-model="file"
                    label="Choose an Excel file"
                    accept=".xls,.xlsx"
                    :rules="checkFile"
                  ></v-file-input>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" type="submit">Upload</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>

            <v-card v-else class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Points</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-data-table
                  :headers="resultHeaders"
                  :items="result"
                  disable-pagination
                  hide-default-footer
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="clear">Upload another file</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
