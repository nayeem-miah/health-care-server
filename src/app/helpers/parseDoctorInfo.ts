// step 4 -------> copy message in gpt (parse message function)
export const parseDoctorInfo = (aiText: string) => {
    // Step 1: Split the text into lines
    const lines = aiText.split("\n");

    // Step 2: Prepare empty result array
    const doctors: any[] = [];
    let currentDoctor: any = {};

    // Step 3: Loop through each line
    for (const line of lines) {
        const trimmed = line.trim();

        // When we find a new doctor entry like "1. Dr. Habibur Rahaman"
        const match = trimmed.match(/^\d+\.\s*Dr\.\s*(.+)/i);
        if (match) {
            // If we already had one doctor, push it
            if (Object.keys(currentDoctor).length > 0) {
                doctors.push(currentDoctor);
            }
            // Start new doctor
            currentDoctor = { name: `Dr. ${match[1].trim()}` };
        }

        // Extract key-value pairs like " - "id": "xxx""
        const keyValue = trimmed.match(/"([^"]+)"\s*:\s*"([^"]*)"/);
        if (keyValue) {
            const [, key, value] = keyValue;
            currentDoctor[key] = value;
        }

        // If there’s a numeric or boolean value
        const keyNumber = trimmed.match(/"([^"]+)"\s*:\s*(\d+)/);
        if (keyNumber) {
            const [, key, value] = keyNumber;
            currentDoctor[key] = Number(value);
        }

        const keyBool = trimmed.match(/"([^"]+)"\s*:\s*(true|false)/);
        if (keyBool) {
            const [, key, value] = keyBool;
            currentDoctor[key] = value === "true";
        }
    }

    // Step 4: Push the last doctor
    if (Object.keys(currentDoctor).length > 0) {
        doctors.push(currentDoctor);
    }

    return doctors;
};
