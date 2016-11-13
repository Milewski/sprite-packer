const exec = require('child_process').exec;

try {

    /**
     * Check if typescript is installed 
     */
    let result = require.resolve('typescript');

    if (result) {

        console.log('Nice.. looks like you already got typescript installed.');

        exec('node_modules/.bin/tsc', error => {

            if (error) {
                console.log('But it looks like it\'s not working properly... ¯\\(ツ)/¯');
                return process.exit(error.code);
            };

            console.log('Compiled Successfully.');

            return process.exit(0)

        });
    }
} catch (e) {

    /**
     * Okay.. then try globally
     */
    exec('tsc', error => {

        /**
         * Then in this case its needed to install typescript
         */
        if (error) {

            console.log('Oh looks like you dont have typescript... let me install it for you.');

            return exec('npm install typescript', (error) => {

                if (error) {

                    console.log(
                        'Installation failed... you can try to run npm install typescript -g manually.'
                    );

                    return process.exit(error.code);
                };

                return exec('node_modules/.bin/tsc', error => {

                    if (error) {

                        console.log('Oh no.. build failed...');

                        return process.exit(error.code);
                    };

                    console.log('Compiled Successfully.');

                    return process.exit(0);

                });

            });

        }

        console.log('Compiled Successfully.');

        process.exit(0);

    });

}


