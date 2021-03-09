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

function formatTime(arrWithTimestamps) {
  const newArr = [];
  arrWithTimestamps.forEach((article) => {
    let newArticle = { ...article };
    newArticle.created_at = new Date(newArticle.created_at);
    newArr.push(newArticle);
  });
  return newArr;
}

const createRef = (list, key, value) => {
  let lookup = {};

  if (Object.keys(list).length) {
    list.forEach((item) => {
      lookup[item[key]] = item[value];
    });
  }

  return lookup;
};

function formatData(arrOfObj, refObj, keyToChange, newKey) {
  const newData = arrOfObj.map(function (inputObject) {
    const newInputObject = { ...inputObject };
    const refObjKey = newInputObject[keyToChange];
    newInputObject[newKey] = refObj[refObjKey];
    delete newInputObject[keyToChange];
    return newInputObject;
  });
  return newData;
}

function renameKey(arrofObj, keyToChange, newKey)
{

}

module.exports = {formatTime, createRef, formatData, renameKey};
