// extract any functions you are using to manipulate your data, into this file
const addVotes = function (array) {
  const newArray = [];

  array.forEach((article) => {
    let newArticle = { ...article };
    if (newArticle.votes === undefined) {
      newArticle.votes = 0;
    }
    newArray.push(newArticle);
  });
  return newArray;
};

module.exports = addVotes;

const formatTime = function (unixTime) {
  const milliSeconds = unixTime * 1000;
  const dateObj = new Date(milliSeconds);
  const humanFormat = dateObj.toLocaleString();
  console.log(dateObj.toISOString());
  // console.log(humanFormat);
};

formatTime(1575909015000);
