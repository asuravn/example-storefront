import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import withTag from "containers/tags/withTag";
import withMerchantShop from "containers/shop/withMerchantShop";
import catalogItemsQuery from "./catalogItems.gql";

/**
 * withCatalogItems higher order query component for fetching primaryShopId and catalog data
 * @name withCatalogItems
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withCatalogItems(Component) {
  @withTag
  @withMerchantShop
  @inject("primaryShopId", "routingStore", "uiStore")
  @observer
  class CatalogItems extends React.Component {
    static propTypes = {
      primaryShopId: PropTypes.string,
      routingStore: PropTypes.object.isRequired,
      merchant: PropTypes.object,
      tag: PropTypes.shape({
        _id: PropTypes.string.isRequired
      }),
      uiStore: PropTypes.object.isRequired
    };

    render() {
      const { primaryShopId, routingStore, uiStore, tag, merchant } = this.props;
      const [sortBy, sortOrder] = uiStore.sortBy.split("-");
      const tagIds = tag && [tag._id];
      const shopIds = merchant && [merchant._id];

      if (!primaryShopId) {
        return (
          <Component
            {...this.props}
          />
        );
      }

      const variables = {
        shopIds,
        ...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: uiStore.pageSize }),
        tagIds,
        sortBy,
        sortByPriceCurrencyCode: uiStore.sortByCurrencyCode,
        sortOrder
      };

      return (
        <Query errorPolicy="all" query={catalogItemsQuery} variables={variables}>
          {({ data, fetchMore, loading }) => {
            const { catalogItems } = data || {};

            return (
              <Component
                {...this.props}
                catalogItemsPageInfo={pagination({
                  fetchMore,
                  routingStore,
                  data,
                  queryName: "catalogItems",
                  limit: uiStore.pageSize
                })}
                catalogItems={(catalogItems && catalogItems.edges) || []}
                isLoadingCatalogItems={loading}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(CatalogItems, Component);

  return CatalogItems;
}
