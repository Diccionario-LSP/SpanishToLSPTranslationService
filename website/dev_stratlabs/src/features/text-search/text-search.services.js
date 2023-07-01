/* eslint-disable no-debugger */
import API from "utils/axios-config";

export const useTextSearchService = () => {

    const search = async (query) => {
        return await API.get('', { params: { word: query } })
            .then(r => {

                return r.data.map(item => {
                    /*
                        { 
                            "sign_gloss_var": "ABRIR",
                            "category": "categoria0",
                            "urlSentence": "s3://sentencesigns/ABRIR_ORACION_6.mp4",
                            "text": "Abro la cortina persiana porque está oscuro y no puedo ver.eaf",
                            "sign_gloss": "abrir",
                            "url": "s3://isolatedsigns/ABRIR.mp4"
                        }
                    */

                    debugger;
                    var word = item.sign_gloss_var.toLowerCase();

                    if (word.length > 0)
                        word = word[0].toUpperCase() + word.substring(1).replaceAll('-', ' ');

                    return {
                        key: (Math.random() * 10000).toString(),
                        query: item.sign_gloss,
                        category: item.category,
                        word: word,
                        wordVideoUrl: API.GetWordUrl(item.url),
                        phrase: item.text.replace('.eaf', ''),
                        phraseVideoUrl: API.GetPhraseUrl(item.urlSentence)
                    }
                })
            });
    };

    return {
        search,
    };
};
