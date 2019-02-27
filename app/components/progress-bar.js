import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  pollTask,
  runTask,
  runDisposables,
  cancelPoll
} from 'ember-lifeline';
import Ember from 'ember';

export default Component.extend({
  // Passed into component
  didChangeAction() {},

  // Can be overridden for testing
  timing: computed(function() {
    // Start with 0 to keep 1-indexed list
    if (Ember.testing) {
      return [0, 100, 1000, 100, 1000, 100];
    }
    return [0, 2000, 8800, 22100, 33200, 56900]; // in ms
  }),

  progressionClass: '',

  // For automated testing
  progressBarPollToken: null,

  didInsertElement() {
    this._super();

    let count = 0;

    const token = pollTask(this, next => {
      debugger;
      if (count >= 5) {
        this.set('progressionClass', `progress-bar__progression--${count}`);
        this.didChangeAction(count);
        cancelPoll(this);
      } else {
        count++;
        this.set('progressionClass', `progress-bar__progression--${count}`);
        this.didChangeAction(count);
        runTask(this, next, this.timing[count]);
      }
    });

    this.set('progressBarPollToken', token);
  },

  didRender() {
    debugger;
  },

  willDestroy() {
    this._super();
    runDisposables(this); // ensure that lifeline will clean up any remaining async work
  },
});
