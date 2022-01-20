import SubmissionDownloadDropdown from '../../../src/components/submission/download-dropdown.vue';

import testData from '../../data';
import { mergeMountOptions, mount } from '../../util/lifecycle';

const mountComponent = (options = undefined) => {
  const form = testData.extendedForms.last();
  return mount(SubmissionDownloadDropdown, mergeMountOptions(options, {
    props: { formVersion: form },
    container: {
      requestData: {
        fields: form._fields,
        keys: testData.standardKeys.sorted()
      }
    }
  }));
};

describe('SubmissionDownloadDropdown', () => {
  describe('button text', () => {
    it('shows the correct text if the submissions are not filtered', () => {
      testData.extendedForms.createPast(1, { submissions: 2 });
      const text = mountComponent().get('button').text();
      text.should.equal('Download 2 records');
    });

    describe('submissions are filtered', () => {
      it('shows correct text while first chunk of submissions is loading', () => {
        testData.extendedForms.createPast(1, { submissions: 2 });
        const dropdown = mountComponent({
          props: { odataFilter: '__system/submitterId eq 1' }
        });
        const text = dropdown.get('button').text();
        text.should.equal('Download matching records');
      });

      it('shows correct text after first chunk of submissions has loaded', async () => {
        testData.extendedForms.createPast(1, { submissions: 2 });
        const dropdown = mountComponent({
          props: { odataFilter: '__system/submitterId eq 1' }
        });
        dropdown.vm.requestData.odataChunk.setFromResponse({
          config: { url: '/v1/projects/1/forms/f.svc/Submissions' },
          status: 200,
          data: { '@odata.count': 1 }
        });
        await dropdown.vm.$nextTick();
        const text = dropdown.get('button').text();
        text.should.equal('Download 1 matching record');
      });
    });
  });

  describe('form does not have a managed key', () => {
    beforeEach(() => {
      testData.extendedProjects.createPast(1, { key: null });
    });

    it('sets the correct href attributes for a form', () => {
      testData.extendedForms.createPast(1, { xmlFormId: 'a b' });
      mountComponent().findAll('a').map(a => a.attributes().href).should.eql([
        '/v1/projects/1/forms/a%20b/submissions.csv.zip',
        '/v1/projects/1/forms/a%20b/submissions.csv.zip?attachments=false',
        '/v1/projects/1/forms/a%20b/submissions.csv'
      ]);
    });

    it('sets the correct href attributes for a form draft', () => {
      testData.extendedForms.createPast(1, { xmlFormId: 'a b', draft: true });
      mountComponent().findAll('a').map(a => a.attributes().href).should.eql([
        '/v1/projects/1/forms/a%20b/draft/submissions.csv.zip',
        '/v1/projects/1/forms/a%20b/draft/submissions.csv.zip?attachments=false',
        '/v1/projects/1/forms/a%20b/draft/submissions.csv'
      ]);
    });

    it('sets the target attribute to _blank', () => {
      testData.extendedForms.createPast(1);
      for (const a of mountComponent().findAll('a'))
        a.attributes().target.should.equal('_blank');
    });

    describe('form does not have a binary field', () => {
      beforeEach(() => {
        testData.extendedForms.createPast(1, {
          fields: [{ path: '/i', type: 'int' }]
        });
      });

      it('disables the "with media" link', () => {
        mountComponent().get('li').classes('disabled').should.be.true();
      });

      it('prevents default', () => {
        const a = mountComponent().get('a');
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });
        a.element.dispatchEvent(event).should.be.false();
      });
    });
  });

  describe('form has a managed key', () => {
    beforeEach(() => {
      const key = testData.standardKeys.createPast(1, { managed: true }).last();
      testData.extendedProjects.createPast(1, { key });
    });

    it('emits a decrypt event for the "with media" link', () => {
      testData.extendedForms.createPast(1, {
        fields: [{ path: '/b', type: 'binary', binary: true }]
      });
      const dropdown = mountComponent();
      dropdown.get('a').trigger('click');
      dropdown.emitted().decrypt.should.eql([
        ['/v1/projects/1/forms/f/submissions.csv.zip']
      ]);
    });

    it('emits a decrypt event for the "without media" link', () => {
      testData.extendedForms.createPast(1);
      const dropdown = mountComponent();
      dropdown.findAll('a')[1].trigger('click');
      dropdown.emitted().decrypt.should.eql([
        ['/v1/projects/1/forms/f/submissions.csv.zip?attachments=false']
      ]);
    });

    it('emits a decrypt event for the "primary data table" link', () => {
      testData.extendedForms.createPast(1);
      const dropdown = mountComponent();
      dropdown.findAll('a')[2].trigger('click');
      dropdown.emitted().decrypt.should.eql([
        ['/v1/projects/1/forms/f/submissions.csv']
      ]);
    });

    it('prevents default', () => {
      testData.extendedForms.createPast(1);
      const a = mountComponent().findAll('a')[1];
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      a.element.dispatchEvent(event).should.be.false();
    });

    it('does not set the target attribute', () => {
      testData.extendedForms.createPast(1);
      for (const a of mountComponent().findAll('a'))
        should.not.exist(a.attributes().target);
    });

    describe('form does not have a binary field', () => {
      beforeEach(() => {
        testData.extendedForms.createPast(1, {
          fields: [{ path: '/i', type: 'int' }]
        });
      });

      it('disables the "with media" link', () => {
        mountComponent().get('li').classes('disabled').should.be.true();
      });

      it('does not emit a decrypt event', () => {
        const dropdown = mountComponent();
        dropdown.get('a').trigger('click');
        should(dropdown.emitted()).be.empty();
      });
    });
  });

  it('passes along the OData filter', () => {
    testData.extendedProjects.createPast(1, { key: null });
    testData.extendedForms.createPast(1);
    const dropdown = mountComponent({
      props: { odataFilter: '__system/submitterId eq 1' }
    });
    dropdown.findAll('a').map(a => a.attributes().href).should.eql([
      '/v1/projects/1/forms/f/submissions.csv.zip?%24filter=__system%2FsubmitterId+eq+1',
      '/v1/projects/1/forms/f/submissions.csv.zip?attachments=false&%24filter=__system%2FsubmitterId+eq+1',
      '/v1/projects/1/forms/f/submissions.csv?%24filter=__system%2FsubmitterId+eq+1'
    ]);
  });
});
