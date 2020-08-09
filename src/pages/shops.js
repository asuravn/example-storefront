import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import withShops from "containers/shop/withShops";
import withShop from "containers/shop/withShop";
import ShopGrid from "components/ShopGrid";
import { inPageSizes } from "lib/utils/pageSizes";

@withShop
@withShops
@inject("routingStore", "uiStore")
@observer
class ShopsPage extends Component {
  static propTypes = {
    shops: PropTypes.array,
    shopsPageInfo: PropTypes.object,
    shop: PropTypes.object,
    initialGridSize: PropTypes.object,
    isLoadingShops: PropTypes.bool,
    routingStore: PropTypes.object,
    uiStore: PropTypes.shape({
      pageSize: PropTypes.number.isRequired,
      setPageSize: PropTypes.func.isRequired,
      setSortBy: PropTypes.func.isRequired,
      sortBy: PropTypes.string.isRequired
    })
  };

  static async getInitialProps({ req }) {
    // It is not perfect, but the only way we can guess at the screen width of the
    // requesting device is to parse the `user-agent` header it sends.
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const width = (userAgent && userAgent.indexOf("Mobi")) > -1 ? 320 : 1024;

    return { initialGridSize: { width } };
  }

  componentDidMount() {
    const { routingStore } = this.props;
    routingStore.setTagId(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.shops !== prevProps.shops) {
      this.trackEvent(this.props);
    }
  }

  setPageSize = (pageSize) => {
    this.props.routingStore.setSearch({ limit: pageSize });
    this.props.uiStore.setPageSize(pageSize);
  };

  setSortBy = (sortBy) => {
    this.props.routingStore.setSearch({ sortby: sortBy });
    this.props.uiStore.setSortBy(sortBy);
  };

  render() {
    const {
      shop: primaryShop,
      shops,
      shopsPageInfo,
      initialGridSize,
      isLoadingShops,
      routingStore: { query },
      shop,
      uiStore
    } = this.props;
    const pageSize = query && inPageSizes(query.limit) ? parseInt(query.limit, 10) : uiStore.pageSize;
    const sortBy = query && query.sortby ? query.sortby : uiStore.sortBy;

    let pageTitle;
    if (primaryShop) {
      pageTitle = primaryShop.name;
      if (primaryShop.description) pageTitle = `${pageTitle} | ${primaryShop.description}`;
    } else {
      pageTitle = "Storefront";
    }

    return (
      <Fragment>
        <Helmet
          title={pageTitle}
          meta={[{ name: "description", content: primaryShop && primaryShop.description }]}
        />
        <ShopGrid
          shops={shops}
          currencyCode={(primaryShop && primaryShop.currency && primaryShop.currency.code) || "USD"}
          initialSize={initialGridSize}
          isLoadingShops={isLoadingShops}
          pageInfo={shopsPageInfo}
          pageSize={pageSize}
          setPageSize={this.setPageSize}
          setSortBy={this.setSortBy}
          sortBy={sortBy}
        />
      </Fragment>
    );
  }
}

export default ShopsPage;
