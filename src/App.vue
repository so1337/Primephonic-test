<template>
  <div id="app">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">

    <v-layout justify-center row wrap>
      <v-flex xs3 sm3 md3>
        <div>Total streamed: {{ totalStreamed }} sec</div>
        <div>Total seconds streamed per label:
        <div :key="label" v-for="(count, label) in totalPerLabel">{{label}} : {{count}} sec</div>
        <div>Top streamed track
          <b>{{mostPopularTrack.track}}</b> was streamed for <b>{{mostPopularTrack.sec}}</b> sec
        </div>
      </v-flex>
    <v-flex xs3 sm3 md3>
      <v-menu
        v-model="showCalendar"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="selectedDate"
            label="Update statistics range starting point"
            prepend-icon="event"
            clearable
            @click:clear="clearDate"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker :max="maxDate" color="green lighten-1" v-model="selectedDate" @input="handleInputUpdate"></v-date-picker>
      </v-menu>
    </v-flex></v-layout>
  </div>
</template>

<script>
import rp from 'request-promise';
import _ from 'lodash';

export default {
  name: 'App',
  data() {
    return {
      list: [],
      totalStreamed: 0,
      showCalendar: false,
      selectedDate: '',
      totalPerLabel: {},
      mostPopularTrack: '',
      maxDate: new Date(Date.now()).toISOString().split('T')[0],
    };
  },
  methods: {
    clearDate() {
      this.selectedDate = '';
      this.loadData();
    },
    handleInputUpdate() {
      this.showCalendar = false;
      this.loadData();
    },
    async loadData() {
      try {
        // If range selected - pass query, if not - avoid query
        const usageRange = this.selectedDate && `?from=${Date.parse(this.selectedDate) / 1000}`;
        const { message, data } = await rp.get({ uri: `http://localhost:3000/usage${usageRange || ''}`, json: true });
        // check response for error
        if (message === 'error') {
          throw new Error(data);
        } else if (this.list !== data) {
          this.list = data;
          const { totalPerLabel, totalStreamed, totalPerTrack } = _.reduce(data, (result, item) => {
            const resultClone = _.clone(result);
            if (!result.totalPerLabel[item.label]) {
              resultClone.totalPerLabel[item.label] = 0;
            }
            if (!resultClone.totalPerTrack[item.track_id]) {
              resultClone.totalPerTrack[item.track_id] = 0;
            }
            resultClone.totalStreamed += item.seconds_streamed;
            resultClone.totalPerTrack[item.track_id] += item.seconds_streamed;
            resultClone.totalPerLabel[item.label] += item.seconds_streamed;
            return resultClone;
          }, { totalPerLabel: {}, totalStreamed: 0, totalPerTrack: {} });
          this.totalPerLabel = totalPerLabel;
          this.totalStreamed = totalStreamed;
          // Sorted arrays are more trustable than "sorted" objects
          this.mostPopularTrack = totalPerTrack ? _(totalPerTrack).map((sec, track) => ({ track, sec })).orderBy('sec', ['desc']).value()[0] : '';
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  created() {
    // init fetch data
    this.loadData();
    // start loop
    setInterval(
      () => {
        this.loadData();
      },
      15000,
    );
  },
};
</script>

<style>
#app {
  font-family: "Roboto";
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
