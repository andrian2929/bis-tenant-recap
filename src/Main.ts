#!/usr/bin/env node

import {Client} from "./Client";
import {program} from 'commander';
import * as dotenv from 'dotenv';
import {ClosedWin, FinalOutput, Opportunity, Option} from "./types";
import * as fs from "fs";

dotenv.config();

class Main {

    private Client: Client;
    private readonly option: Option;

    private Users: { id: number; name: string; }[] = [];

    constructor() {
        this.Client = new Client();
        this.configureCommander();
        this.option = program.opts()
        this.validateOption();
    }

    /**
     * Configures the commander by adding required options for the program.
     */
    private configureCommander() {
        program
            .requiredOption('-s, --since <since>', 'Since date')
            .requiredOption('-u, --until <until>', 'Until date')
            .usage('Bis tenant')
            .parse();
    }

    private validateOption() {
        const dateRegexPattern = /^\d{4}-\d{2}-\d{2}$/;
        if (
            !dateRegexPattern.test(this.option.since) ||
            !dateRegexPattern.test(this.option.until)
        ) throw new Error('Invalid date format');
    }


    public async getOpportunityConversion() {

        const result = await this.Client.getOpportunityConversion(this.option.since, this.option.until);

        if (!result) return null;

        // @ts-ignore
        if (result.length === 0) return null;

        // @ts-ignore
        const opportunityConversion: Opportunity[] = result.map((item: any) => {
            return {
                userId: item.id,
                name: item.name,
                opportunityConversionSum: Number(item.total_time_diff_seconds),
                opportunityConversionAverage: Number(item.average_time_diff_seconds),
                opportunityConversionCount: Number(item.data_count),
            }
        })

        return opportunityConversion;
    }


    public async getClosedWinConversion() {
        const result = await this.Client.getCloseWinConversion(this.option.since, this.option.until);

        if (!result) return null;

        // @ts-ignore
        if (result.length === 0) return null;

        // @ts-ignore
        const closedWinConversion: ClosedWin[] = result.map((item: any) => {
            return {
                userId: item.id,
                name: item.name,
                closedWinConversionSum: Number(item.total_time_diff_seconds),
                closedWinConversionAverage: Number(item.average_time_diff_seconds),
                closedWinConversionCount: Number(item.data_count),
            }
        })

        return closedWinConversion;

    }

    public async getUsers() {
        const opportunityConversion = await this.getOpportunityConversion();
        const closedWinConversion = await this.getClosedWinConversion();

        const users: { id: string; name: string; }[] = [];

        if (opportunityConversion) {
            for (const item of opportunityConversion) {
                if (!users.find(user => user.id === item.userId)) {
                    users.push({
                        id: item.userId,
                        name: item.name
                    })
                }
            }
        }

        if (closedWinConversion) {
            for (const item of closedWinConversion) {
                if (!users.find(user => user.id === item.userId)) {
                    users.push({
                        id: item.userId,
                        name: item.name
                    })
                }
            }
        }

        return users;
    }

    public async getFinalOutput(): Promise<FinalOutput[]> {

        const finalOutput: FinalOutput[] = [];

        const users = await this.getUsers();

        const opportunityConversion = await this.getOpportunityConversion();

        const closedWinConversion = await this.getClosedWinConversion();

        for (const user of users) {
            const finalOutputUser: FinalOutput = {
                id: user.id,
                name: user.name,
                opportunityConversionSum: 0,
                opportunityConversionAverage: 0,
                opportunityConversionCount: 0,
                closedWinConversionSum: 0,
                closedWinConversionAverage: 0,
                closedWinConversionCount: 0,
            }

            if (opportunityConversion) {
                const opportunityConversionUser = opportunityConversion.find(item => item.userId === user.id)
                if (opportunityConversionUser) {
                    finalOutputUser.opportunityConversionSum = opportunityConversionUser.opportunityConversionSum;
                    finalOutputUser.opportunityConversionAverage = opportunityConversionUser.opportunityConversionAverage;
                    finalOutputUser.opportunityConversionCount = opportunityConversionUser.opportunityConversionCount;
                }
            }

            if (closedWinConversion) {
                const closedWinConversionUser = closedWinConversion.find(item => item.userId === user.id)
                if (closedWinConversionUser) {
                    finalOutputUser.closedWinConversionSum = closedWinConversionUser.closedWinConversionSum;
                    finalOutputUser.closedWinConversionAverage = closedWinConversionUser.closedWinConversionAverage;
                    finalOutputUser.closedWinConversionCount = closedWinConversionUser.closedWinConversionCount;
                }
            }

            finalOutput.push(finalOutputUser);
        }

        return finalOutput;
    }

    write(filename: string, data: any) {
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    }
}


(async () => {
    const client = new Main();
    const finalOutput = await client.getFinalOutput();
    client.write('output.json', finalOutput);

})();


