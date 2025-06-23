# TSE - Testing

## Student Information

First Name: Stefan

Last Name: Kruik

Student number: 500895667

## Assignment 1

### 1. Git log

```sh
48b326fx 2025-02-24     Fix: process merge request fixes
b57cd82x 2025-02-24     Feat: add new Sonarqube reports to README
16bd1a6x 2025-02-24     Test: add coverage to main CLI
6c9fb89x 2025-02-24     Feat: add Sonarqube reports to README.md
71bbd5ex 2025-02-24     Fix: process merge request & Sonarqube feedback
6a41370x 2025-02-21     Fix: correct Maven run flags
270977bx 2025-02-21     Feat: Sonarqube test coverage & rapporting
2e626d9x 2025-02-21     Fix: correct Sonarqube artifact output path
d5f430dx 2025-02-21     Fix: correct project configuration in POM
0986674x 2025-02-21     Fix: correct execution path in pipeline
47512e8x 2025-02-21     Merge branch 'main' of gitlab.fdmci.hva.nl:se-specialization-2024-2/tse2/stefan-kruik/testing
8813031x 2025-02-21     Feat: integrate Sonarqube with CI
591ebacx 2025-02-21     Feat: integrate Sonarqube with CI
6595fdbx 2025-02-21     Feat: implement BSN validation logic & input system
f843473x 2025-02-21     Test: add BSN validation logic tests
70b7d05x 2025-02-21     Chore: make the BSN validator assignment baseplate
5d3ed8fx 2025-02-20     Complete the TDD Palindrome assignment code & results
b5f4ea3x 2025-02-20     Add assignment README.md baseplate & .gitignore
971964bx 2025-02-10     Initial commit
```

### 2. SonarQube

#### Screenshots

The following screenshot contains the overview of my dashboard which shows the results on 24/02/2025:

![SonarQube Overview](/Files/Images/Sonarqube/Overview.png)

And here some screenshots of me fixing SonarQube feedback:

![SonarQube Feedback 1](/Files/Images/Sonarqube/Feedback_1.png)
![SonarQube Feedback 2](/Files/Images/Sonarqube/Feedback_2.png)

Compared to this initial run where there were multiple issues and no test coverage:

![SonarQube Initial Run](/Files/Images/Sonarqube/Initial.png)

#### Issues

One thing that immediately stands out is the number of issues I have resolved. SonarQube detected the following issues that I swiftly resolved, that mostly impacted readability and in turn maintability:

- Ambigious regex: instead of using `\\d+` I used `[0-9]+`. They have the same effect and the new one is more concise.
- Ternary operator: I used a one-liner to return the result of the `validate` method. While compact, readibility is worse.
- Use logger instead of System.out: with this one I disagreed because logger also adds date and `[INFO]` to the console, which my CLI does not need. I still processed it, but did not alter my code for these issues.

So only minor improvements, but of course still worth looking at. Especially the readability issues are important if we start working in teams later on.

#### Coverage

On the first runs I was also missing testing coverage detection because of missing configuration in my pipeline. I added reporting and SonarQube quickly picked it up.

Later I also added test coverage for the CLI part of my application, as before I only tested the validator itself.

#### Other Metrics

SonarQube did not find issues with the other criteria/metrics.

#### Deployment

I have self-hosted an instance of SonarQube on my homelab over at [api.stefankruik.com/sonarqube](https://api.stefankruik.com/sonarqube). The analysis is run in [GitLab CI/CD](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/testing/-/pipelines) which connects to my hosted dashboard.

### 3. Test Driven Development

#### Best test class

```java
void bsnMainInputValidTest() {
    // Valid checksum
    input = "440015078\nexit\n";

    // Input
    ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
    System.setIn(in);

    // Output
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    System.setOut(new PrintStream(out));

    // Run
    BsnMain.main(new String[0]);
    String output = out.toString();
    assertTrue(output.contains("Valid BSN."));
}
```

Even though the BSN application is fairly simple so adding complex and in-depth tests is harder, the snippet provided above complies with AAA, FIRST, Right-BICEP and CORRECT.

I first create the input and I/O reader. After inputting the input I check if it was marked as valid. This complies with AAA.

The tests are fast, do not rely on others, have consistent output, are named clearly and were added timely. This complies with FIRST.

Then for Right-BICEP of course the results are right. Boundary conditions are handled by the other tests. Because this test literally inputs text into the application this covers the inverse relationship, because I indirectly test the validator. This goes hand-in-hand with cross checking. Errors are handled by the other tests. And finally this test is performant.

#### Links

[Tested Class](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/testing/-/blob/main/BSN/src/main/java/nl/hva/bsn/BsnMain.java)

[Test Class](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/testing/-/blob/main/BSN/src/test/java/nl/hva/bsn/BsnMainTest.java)

### 4. Code Reviews

#### Comment Screenshots

Sample screenshot of one of my comments:

![BSN Review](/Files/Images/Reviews/tjokrod1.png)

Full merge request on the repository of Donovan Tjokrodimedjo:

[Merge Request Link](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/donovan-tjokrodimedjo/testing/-/merge_requests/2)
