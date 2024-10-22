const fs = require('fs').promises;

async function readStudentsAndModules(studentFile, studentUserModel) {
    try {
        const data = await fs.readFile(studentFile, 'utf-8');
        const lines = data.trim().split('\n');
        let lineIndex = 0;

        // Number of students
        const numStudents = parseInt(lines[lineIndex++].trim(), 10);

        for (let i = 0; i < numStudents; i++) {
            const line = lines[lineIndex++];
            if (!line) continue;

            const studentDetails = line.split(';');
            if (studentDetails.length < 4) continue;

            const studentClass = studentDetails[0];
            const adminNumber = studentDetails[1];
            const name = studentDetails[2];
            const numModules = parseInt(studentDetails[3], 10);

            // Create a new Student object (assuming you have a Student class/model)
            const student = new Student(studentClass, adminNumber, name);

            let index = 4;
            for (let j = 0; j < numModules; j++) {
                if (index + 3 >= studentDetails.length) break;

                const moduleCode = studentDetails[index++];
                const moduleName = studentDetails[index++];
                const creditUnit = parseInt(studentDetails[index++], 10);
                const marks = parseFloat(studentDetails[index++]);

                // Create a new Module object (assuming you have a Module class/model)
                const module = new Module(moduleCode, moduleName, creditUnit);
                module.setMarks(marks);

                // Add the module to the student
                student.addModule(module);
            }

            // Add the student to the studentUserModel
            studentUserModel.addStudent(student);
        }
    } catch (error) {
        console.error('Error reading students and modules:', error.message);
        console.error(error.stack);
    }
}



async function createStudentFile(studentFile, studentUserModel, moduleModel) {
    try {
        const students = studentUserModel.getStudents();
        const modules = moduleModel.getModules();
        let data = '';

        // Writing the number of students
        data += students.length + '\n';

        // Writing student data
        for (const student of students) {
            data += student.getStudentClass() + ';'
                + student.getAdminNumber() + ';'
                + student.getName() + ';'
                + student.getNumberOfModules() + ';';

            // Writing student modules
            for (const module of student.getModules()) {
                data += module.getModuleCode() + ';'
                    + module.getModuleName() + ';'
                    + module.getCreditUnit() + ';'
                    + module.getMarks() + ';';
            }
            data += '\n';
        }

        // Writing the number of modules
        data += modules.length + '\n';

        // Writing module data
        for (const module of modules) {
            data += module.getModuleCode() + ';'
                + module.getModuleName() + ';'
                + module.getCreditUnit() + ';'
                + module.getMarks() + '\n';
        }

        // Writing the data to the file
        await fs.writeFile(studentFile, data, 'utf-8');
        console.log('File has been written successfully.');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}