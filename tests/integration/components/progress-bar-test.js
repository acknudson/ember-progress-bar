import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { pollTaskFor } from 'ember-lifeline';
import ProgressBar from 'ember-progress-bar/components/progress-bar';

module('Integration | Component | progress-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const didChangeActionSpy = sinon.spy();
    this.set('didChangeAction', didChangeActionSpy);

    let instance;
    this.owner.register('component:progress-bar', ProgressBar.extend({
      didInsertElement() {
        this._super();
        instance = this;
      }
    }));

    await render(hbs`
      {{progress-bar
        didChangeAction=didChangeAction}}`);

    assert.dom('.progress-bar__grey-background').exists();
    assert.dom('.progress-bar__progression').exists();
    assert.dom('.progress-bar__progression--1').exists();
    assert.ok(didChangeActionSpy.calledWith(1));

    await pollTaskFor(instance.progressBarPollToken);
    // didRender hook isn't being called after the polltask and before this assertion
    assert.dom('.progress-bar__progression--2').exists();
    assert.ok(didChangeActionSpy.calledWith(2));

    await pollTaskFor(instance.progressBarPollToken);
    assert.dom('.progress-bar__progression--3').exists();
    assert.ok(didChangeActionSpy.calledWith(3));

    await pollTaskFor(instance.progressBarPollToken);
    // didRender hook isn't being called after the polltask and before this assertion
    assert.dom('.progress-bar__progression--4').exists();
    assert.ok(didChangeActionSpy.calledWith(4));

    await pollTaskFor(instance.progressBarPollToken);
    await settled();

    assert.dom('.progress-bar__progression--5').exists();
    assert.ok(didChangeActionSpy.calledWith(5));
  });
});
