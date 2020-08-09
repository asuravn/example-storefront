import React from "react";
import PropTypes from "prop-types";
import { Query, withApollo } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import { availablePaymentMethods as availablePaymentMethodsQuery } from "./queries.gql";
import {inject} from "mobx-react";

/**
 * withAvailablePaymentMethods higher order query component for fetching an order
 * @name WithAvailablePaymentMethods
 * @param {React.Component} Component to decorate
 * @returns {React.Component} - Component with `cart` props and callbacks
 */
export default function withAvailablePaymentMethods(Component) {
  @withApollo
  @inject("primaryShopId" )
  class WithAvailablePaymentMethods extends React.Component {
    static propTypes = {
      primaryShopId: PropTypes.string.isRequired,
      cart: PropTypes.shape({
        shop: PropTypes.shape({
          _id: PropTypes.string.isRequired
        }).isRequired
      })
    }

    render() {
      const { cart, primaryShopId } = this.props;

      const isReadyToLoad = !!cart;
      const variables = { shopId: primaryShopId };

      return (
        <Query errorPolicy="all" query={availablePaymentMethodsQuery} variables={variables} skip={!isReadyToLoad}>
          {({ loading: isLoadingAvailablePaymentMethods, data }) => {
            const { availablePaymentMethods } = data || {};

            return (
              <Component
                {...this.props}
                availablePaymentMethods={availablePaymentMethods}
                isLoadingAvailablePaymentMethods={isReadyToLoad && isLoadingAvailablePaymentMethods}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(WithAvailablePaymentMethods, Component);

  return WithAvailablePaymentMethods;
}
