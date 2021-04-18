var conn = require('./db');

class Pagination {
    constructor(query, params = [], itensPerPage = 10) {
        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentPage = 1;
    }

    getPage(pagina) {
        this.currentPage = pagina - 1;
        this.params.push(
            this.currentPage * this.itensPerPage,
            this.itensPerPage
        )
        return new Promise((res, rej) => {
            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, results) => {
                if (err) { rej(err); } else { 
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);
                    this.currentPage++;
                    
                    res(this.data); 
                }
            })
        })
    }

    getPageNavigation(params) {
        let limitPagesNav = 5;
        let links = [];
        let nrstart = 0;
        let nrend = 0;

        if (this.getTotalPages() < limitPagesNav) {
            limitPagesNav = this.getTotalPages();
        }

        // se estamos nas primeiras paginas
        if( ( this.getCurrentPage() - parseInt(limitPagesNav / 2) ) < 1) {
            nrstart = 1;
            nrend = limitPagesNav;
        } 
        // estamos chegando nas ultimas paginas
        else if ( ( this.getCurrentPage() + parseInt(limitPagesNav / 2) ) > this.getTotalPages() ) {
            nrstart = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages();
        }
        // estamos no meio da navegação
        else {
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2);
        }

        if(this.getCurrentPage() > 1) {
            links.push({
                text: '«',
                href: '?' + this.getQueryString( Object.assign({}, params, {page: this.getCurrentPage() - 1 }) ),
            });
        }

        for (let x = nrstart; x <= nrend; x++) {
            links.push({
                text: x,
                href: '?' + this.getQueryString( Object.assign({}, params, {page: x}) ),
                active: (x === this.getCurrentPage())
            });
        }

        if(this.getCurrentPage() < this.getTotalPages()) {
            links.push({
                text: '»',
                href: '?' + this.getQueryString( Object.assign({}, params, { page: this.getCurrentPage() + 1 }) ),
            });
        }


        return links;
    }

    getQueryString(params) {
        let queryString = [];
        for(let name in params) {
            queryString.push(`${name}=${params[name]}`)
        }

        return queryString.join('&');
    }

    getTotal = () => this.total;
    getCurrentPage = () => this.currentPage;
    getTotalPages = () => this.totalPages;
}

module.exports = Pagination;