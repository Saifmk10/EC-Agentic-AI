import nlp from 'compromise';
import * as chrono from 'chrono-node';

class DataParsing {
    static entityExtraction(text) {
        let name = null;
        let user_set_time = null;
        let user_set_date = null;

        // Extract PERSON names
        let doc = nlp(text);
        let people = doc.people().out('array'); // list of names
        if (people.length > 0) {
            // Take the first person name and clean " at ..." if present
            name = people[0].split(" at")[0].trim();
            console.log("debug doctor name from DataParsing.js:", name);
        }

        // Extract dates/times
        let results = chrono.parse(text);
        if (results.length > 0) {
            results.forEach(result => {
                if (result.start.isCertain('hour') || result.start.isCertain('minute')) {
                    user_set_time = result.start.date().toLocaleTimeString();
                }
                if (result.start.isCertain('day') || result.start.isCertain('month') || result.start.isCertain('year')) {
                    user_set_date = result.start.date().toLocaleDateString();
                }

                console.log("debug time from DataParsing.js:", user_set_time);
                console.log("debug date from DataParsing.js:", user_set_date);
            });
        } else {
            console.log("No time found.");
        }

        return [name, user_set_time, user_set_date];
    }
}

export default DataParsing;

// uncomment for debug purpose
// const doctor = DataParsing.entityExtraction("Book an appointment for 19th october with Robert at 4pm");
// console.log("DOCTOR NAME:", doctor[0]);
// console.log("TIME OF APPOINTMENT:", doctor[1]);
// console.log("DATE OF APPOINTMENT:", doctor[2]);
