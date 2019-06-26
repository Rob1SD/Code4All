import Axios from 'axios';
import qs from 'qs';
import { Input } from 'antd';
import consts from '../Providers/consts'
import files from '../Providers/files';

const Search = Input.Search;



class Exercices {
    async getMines() {
        var headers = {
            'Authorization': 'Bearer ' +  localStorage.sessionToken
        }

        return Axios.get(consts.url() + "exercices/getUserExercices", {headers: headers}).then(response => {
            return response;
        }).catch(error => {
            alert(JSON.stringify(error));
        });
    }

    getMyExercice(id, cb) {
        var headers = {
            'Authorization': 'Bearer ' +  localStorage.sessionToken
        }

        return Axios.get(consts.url() + "exercices/getExercice/" + id, {headers: headers}).then(response => {
            return cb(response);
        }).catch(error => {
            alert(JSON.stringify(error));
        });
    }

    extractPatternsFromArray(array, patterns) {
        var newElements = array.map((element) => {
            if(element.patternId !== null && element.patternId !== undefined && !patterns.includes(element.patternId)) {
                patterns.push(element.patternId);
            }
            return element;
        });
    }

    extractPatterns(exercice) {
        var patterns = [];
        if(exercice.patternId !== null && exercice.patternId !== undefined) {
            patterns.push(exercice.patternId);
        }
        this.extractPatternsFromArray(exercice.blocks, patterns);
        this.extractPatternsFromArray(exercice.npcs, patterns);
        this.extractPatternsFromArray(exercice.pcs, patterns)
        return patterns;
    }

    async createExercice(exercice) {
        var patterns = this.extractPatterns(exercice);

        let data = {'exercice': JSON.stringify(exercice)};
        console.log(data);

        Axios.post(consts.url() + 'exercices/add', qs.stringify(data),
        {
            headers: {
                'Authorization': 'Bearer ' +  localStorage.sessionToken
            }
        })
          .then(async function (response) {
            await Promise.all(patterns.map(item => files.uploadFileToExo(response.data.insertId, item)));
            window.location.href = "/exercices";
          })
          .catch(function (error) {
            alert(JSON.stringify(error.response));
          });
    }

    async modifyExercice(exercice, id) {
        var patterns = this.extractPatterns(exercice);

        let data = {'exercice': JSON.stringify(exercice)};
        console.log(data);

        // EXTRACT NOT SAVED PATTERN
    
        Axios.post(consts.url() + 'exercices/modify/' + id, qs.stringify(data),
        {
            headers: {
                'Authorization': 'Bearer ' +  localStorage.sessionToken
            }
        })
          .then(async function (response) {
            await Promise.all(patterns.map(item => files.uploadFileToExo(response.data.insertId, item)));
            window.location.href = "/exercices";
          })
          .catch(function (error) {
              console.log(JSON.stringify(error));
            alert(JSON.stringify(error.response));
          });
    }

    deleteExercice(id) {
        Axios.post(consts.url() + 'exercices/delete/' + id, {}, {
            headers: {
                'Authorization': 'Bearer ' +  localStorage.sessionToken
            }
        })
        .then(function (response) {
            window.location.href = "/exercices";
          })
        .catch(function (error) {
            alert(JSON.stringify(error.response));
        });
    }

    async getFromStore() {
        return await new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve([
                {
                    id: 2,
                    name: "coucou",
                    description: "coucoud"
                },
                {
                    id: 3,
                    name: "jesus",
                    description: "jesus2"
                }
            ]);
            }, 300);
        });
    }
}

export default new Exercices();