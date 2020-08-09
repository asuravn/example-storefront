import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import track from "lib/tracking/track";
import PageLoading from "components/PageLoading";
import PageStepper from "components/PageStepper";
import PageSizeSelector from "components/PageSizeSelector";
import SortBySelector from "components/SortBySelector";
import ShopGridEmptyMessage from "./ShopGridEmptyMessage";
import ShopGridContainer from "./ShopGridContainer";

const styles = (theme) => ({
  filters: {
    justifyContent: "flex-end",
    marginBottom: theme.spacing.unit * 2
  }
});

@withStyles(styles, { name: "SkProductGrid" })
@track()
export default class ShopGrid extends Component {
  static propTypes = {
    shops: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    currencyCode: PropTypes.string.isRequired,
    initialSize: PropTypes.object,
    isLoadingShops: PropTypes.bool,
    pageInfo: PropTypes.shape({
      startCursor: PropTypes.string,
      endCursor: PropTypes.string,
      hasNextPage: PropTypes.bool,
      hasPreviousPage: PropTypes.bool,
      loadNextPage: PropTypes.func,
      loadPreviousPage: PropTypes.func
    }),
    pageSize: PropTypes.number.isRequired,
    setPageSize: PropTypes.func.isRequired,
    setSortBy: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired
  };

  renderMainArea() {
    const { shops, initialSize, isLoadingShops, pageInfo } = this.props;

    if (isLoadingShops) return <PageLoading />;

    const shopItems = (shops || []).map((item) => item.node);
    if (shopItems.length === 0) return <ShopGridEmptyMessage />;

    return (
      <Fragment>
        <Grid container spacing={24}>
          <ShopGridContainer
            initialSize={initialSize}
            onItemClick={this.onItemClick}
            shops={shops}
            placeholderImageURL="/static/images/placeholder.gif"
            {...this.props}
          />
        </Grid>
        {pageInfo && <PageStepper pageInfo={pageInfo} />}
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderMainArea()}
      </Fragment>
    );
  }
}
