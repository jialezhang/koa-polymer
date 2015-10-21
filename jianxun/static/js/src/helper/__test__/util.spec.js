import { formatTime, nowTime, camelString, convertTime, formatJD, generateTimeOptions } from '../lib/utils';

// describe('test for convertion form unixtime to 年月日', () => {
//   it('test start', () => {
//     let testTime = 1444202138240;
//     expect(formatTime(testTime).toBe('10月7日'));
//   });
// });


describe('test for get time now ', () => {
  it('test start', () => {
    let rawTime = new Date(),
        timeYear = rawTime.getFullYear(),
        timeMonth = rawTime.getMonth() + 1,
        timeDay = rawTime.getDate(),
        time =  timeYear + '.' + timeMonth + '.' + timeDay;
    expect(nowTime()).toBe(time);
  });
});

describe('test for convertime from unixTime', () => {
  it('get unixTime', () => {
    let testTime = 1444374222239;

    expect(convertTime(testTime)).toBe('2015.9.5');
  });
});

describe('test for format 职位描述', () => {
  it('get 职位描述', () => {
    let testString = '职位描述: 哈哈哈哈哈'; 
    expect(formatJD(testString)).toBe(': 哈哈哈哈哈');
  });
})
// describe("nowTime", function() {
//   it("get time with dot",  () =>  {
//     expect(nowTime()).toBe('2015.10.7');
//   });
// });

describe("camelString", function() {
  it("trnasform string to camel",  ()  => {
    expect(camelString('JIALE')).toBe('Jiale');
  });
});

// describe('test for generateTimeOptions', () => {
//   jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
//   let $ = $j; 

//   loadFixtures('generateTimeOption.html');
//   // console.log($('#raw-time-option')[0]);
//   console.log(generateTimeOptions);
//   it('check for generateTimeOptions', () => {
//     expect(generateTimeOptions('year', '.test-for-year-select', '.time-year', 1, 12)).toBe('');
//   });
// });
