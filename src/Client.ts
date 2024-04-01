import MySql from "./MySql";

export class Client {

    private Mysql: MySql;

    constructor() {
        this.Mysql = new MySql({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: Number(process.env.MYSQL_PORT),
        })
    }

    public async getOpportunityConversion(startDate: string, endDate: string) {
        const query = `SELECT id, name, COUNT(*) as data_count, SUM(time_diff_seconds) AS total_time_diff_seconds, AVG(time_diff_seconds) AS average_time_diff_seconds FROM (SELECT prospect_leads.owner as id, tenant_users.name as name, TIMESTAMPDIFF(SECOND, prospect_leads.created_at, prospect_leads.conversion_datetime) AS time_diff_seconds FROM prospect_leads INNER JOIN tenant_users ON prospect_leads.owner = tenant_users.user_uuid WHERE prospect_leads.conversion_datetime IS NOT NULL AND (DATE(prospect_leads.created_at) >= '${startDate}' AND DATE(prospect_leads.created_at) <= '${endDate}')) AS subquery GROUP BY id`;
        return await this.Mysql.query(query)
    }

    public async getCloseWinConversion(startDate: string, endDate: string) {
        const query = `SELECT id, name, COUNT(*)  as data_count, SUM(time_diff_seconds) AS total_time_diff_seconds, AVG(time_diff_seconds) AS average_time_diff_seconds FROM (SELECT po.owner, tenant_users.user_uuid as id, tenant_users.name  as name, poc.created_at  AS stage_changed_at, TIMESTAMPDIFF(SECOND, po.created_at, poc.created_at) AS time_diff_seconds FROM prospect_opportunities po JOIN (SELECT poc_inner.created_at, poc_inner.opportunity_id FROM prospect_opportunity_stage_changes poc_inner JOIN (SELECT MAX(created_at) AS latest_created_at, opportunity_id FROM prospect_opportunity_stage_changes WHERE opportunity_stage_id = 6 GROUP BY opportunity_id) AS poc_latest ON poc_inner.opportunity_id = poc_latest.opportunity_id AND poc_inner.created_at = poc_latest.latest_created_at) AS poc ON po.id = poc.opportunity_id INNER JOIN tenant_users ON po.owner = tenant_users.user_uuid AND (DATE(po.created_at) >= '${startDate}' AND DATE(po.created_at) <=  '${endDate}')) AS subquery GROUP BY id`;
        return await this.Mysql.query(query)
    }
}

