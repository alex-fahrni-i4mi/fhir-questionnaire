import { Questionnaire, QuestionnairePublicationStatus } from '@i4mi/fhir_r4';
import { QuestionnaireData } from '../dist/QuestionnaireData';

const VARIOUS = require('./questionnaires/variousTypes.json') as Questionnaire;

const EMPTY_QUESTIONNAIRE = require('./questionnaires/empty.json') as Questionnaire;

const LANG = ['en'];
const testData = new QuestionnaireData(VARIOUS, LANG);
const emptyData = new QuestionnaireData(EMPTY_QUESTIONNAIRE, LANG);

// TODO: test with external valuesets
// TODO: test hidden items


test('getQuestions()', () => {
    expect(testData.getQuestions().length).toBe(VARIOUS.item?.length);
});

test('serialize() / unserialize()', () => {
    const serialized = testData.serialize();
    expect(typeof serialized).toBe('string');

    // rehydrate manually
    const unserialized  = JSON.parse(serialized);
    const rehydrated = new QuestionnaireData(VARIOUS, LANG, unserialized.valueSets, unserialized.items, unserialized.hiddenFhirItems);
    expect(rehydrated).toEqual(testData);

    // rehydrate with method
    const rehydrated2 = new QuestionnaireData(VARIOUS, LANG);
    rehydrated2.unserialize(serialized);
    expect(rehydrated2).toEqual(testData);

    // rehydrate with whole stringified object
    const rehydrated3 = new QuestionnaireData(VARIOUS, LANG);
    rehydrated3.unserialize(JSON.stringify(testData));
    expect(rehydrated3).toEqual(testData);
});

test('getQuestionnaireTitle()', () => {
    expect(testData.getQuestionnaireTitle(LANG[0])).toBe(VARIOUS.title);
    expect(emptyData.getQuestionnaireTitle(LANG[0])).toBeUndefined();
});

test('getQuestionnaireURLwitVersion()', () => {
    const noVersion = new QuestionnaireData({
        resourceType: 'Questionnaire',
        status: QuestionnairePublicationStatus.ACTIVE,
        url: 'http://test.com'
    }, LANG);
    const noUrl = new QuestionnaireData({
        resourceType: 'Questionnaire',
        status: QuestionnairePublicationStatus.ACTIVE,
        version: '1.0'
    }, LANG);

    expect(testData.getQuestionnaireURLwithVersion()).toEqual(VARIOUS.url  + '|' + VARIOUS.version);
    expect(emptyData.getQuestionnaireURLwithVersion()).toEqual('');
    expect(noVersion.getQuestionnaireURLwithVersion()).toEqual('http://test.com');
    expect(noUrl.getQuestionnaireURLwithVersion()).toEqual('');
});

test('findQuestionById()', () => {
    // top level
    expect(testData.findQuestionById('1-group')).toBeDefined();
    // sub level
    expect(testData.findQuestionById('1.2.4-boolean')).toBeDefined();
    // not found
    expect(testData.findQuestionById('noValidID')).toBeUndefined();
    // no data
    expect(emptyData.findQuestionById('1-group')).toBeUndefined();
    // explicitly provide data
    expect(testData.findQuestionById('1-group', testData.getQuestions())).toBeDefined();
    // explicitly provide empty data
    expect(testData.findQuestionById('1-group', [])).toBeUndefined();
});


// resetResponse()

// updateQuestionAnswers(_question: IQuestion, _answer: IAnswerOption | undefined): void {

// isAnswerOptionSelected(_question: IQuestion, _answer: IAnswerOption): boolean {

// restoreAnswersFromQuestionnaireResponse(_fhirResponse: QuestionnaireResponse): void {

//  getQuestionnaireResponse()

// isResponseComplete(_onlyRequired?: boolean): boolean {

//  populateAnswers(_resources: Resource[], _overWriteExistingAnswers?: boolean): void {

// also test depending questions