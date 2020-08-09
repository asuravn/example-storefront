import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import {inject, observer} from "mobx-react";
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import shopsQuery from "./publicShops.gql";

/**
 * withShops higher order query component for fetching public shops
 * @name withShops
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and shop as props
 */
export default function withShops(Component) {
  @inject("routingStore", "uiStore")
  @observer
  class Shops extends React.Component {
    static propTypes = {
      router: PropTypes.object.isRequired,
      routingStore: PropTypes.object.isRequired,
      uiStore: PropTypes.object.isRequired
    };

    render() {
      const { routingStore, uiStore, tag, merchant } = this.props;
      const [sortBy, sortOrder] = uiStore.sortBy.split("-");
  
      const variables = {
        ...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: uiStore.pageSize }),
        sortBy,
        sortOrder
      };

      return (
        <Query errorPolicy="all" query={shopsQuery} variables={variables}>
          {({ data, fetchMore, loading }) => {
            const { publicShops } = data || {};
    
            return (
              <Component
                {...this.props}
                shopsPageInfo={pagination({
                  fetchMore,
                  routingStore,
                  data,
                  queryName: "shops",
                  limit: uiStore.pageSize
                })}
                shops={(publicShops && publicShops.edges) || []}
                isLoadingShops={loading}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(Shops, Component);

  return Shops;
}
