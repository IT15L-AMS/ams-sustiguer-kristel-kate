
exports.calculateGPA = (enrollments) => {
    let totalPoints = 0;
    let totalCredits = 0;

    enrollments.forEach(en => {
        if (en.grade && en.Course) {
            totalPoints += parseFloat(en.grade) * en.Course.credits;
            totalCredits += en.Course.credits;
        }
    });

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
};