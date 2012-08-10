$(function() {
  var brandActionId = function(element) {
    return $(element).closest('.advanced_targeting_options').attr('id').split('_')[4];
  };

  var toggleFulfillmentOptions = function(){
    if ($("#brand_action_fulfillment_attributes_fulfillment_type_physical_shipment").prop("checked") == true) {
      $("#fulfillment-shipping-options").show();
    } else {
      $("#fulfillment-shipping-options").hide();

      $("#brand_action_fulfillment_attributes_number_of_items," +
        "#brand_action_fulfillment_attributes_shipment_weight").val("");
    }
  };

  $("#member_filter_form")
    .bind("loading", function() {
      $("#summary").spinner();
    })
    .bind("loading-complete", function() {
      $("#summary").unspinner();
    });

  $("#brand_action_fulfillment_attributes_fulfillment_type_physical_shipment," +
    "#brand_action_fulfillment_attributes_fulfillment_type_electronic_download").bind("change", function() {
    toggleFulfillmentOptions();
  });

  //
  // Advanced Targeting
  //
  $("a.remove").live("click", function() {
    $("#advanced_targeting_options_for_" + brandActionId(this)).remove();
    return false;
  });

  $(".poll_option").live("change", function() {
    $(".unselect_all").prop("checked", false);
  });


  //
  // Demographic Targeting
  //
  $("#add-demograph-target").click(function(){
    $("#demographic-targeting-actions").show();
    $(this).hide();
    return false;
  });

  $("#demographic-targeting-actions").change(function(){
    var value = $.trim($(this).val());

    $(this).hide();
    $("#add-demograph-target").show();

    if (value == "") {
      return false;
    }

    $("#add-demograph-target").hide();
    $("#advanced-targeting-summary").spinner();

    $.ajax({
      url  : CrowdTap.routes.clients_brand_action_demograph_target_forms,
      type : "GET",
      data : {
        info_poll_id    : value,
        brand_action_id : CrowdTap.brand_action_id,
        brand_id        : CrowdTap.brand_id
      },
      dataType : "html",
      success  : function(data) {
        $("#add-demograph-target").show();
        $("#advanced-targeting-summary").unspinner();
        $("#demograph-target-list").append(data);
        checkForMaxTargetedDemographicActions();
      }
    });
  });

  var checkForMaxTargetedDemographicActions = function(e) {
    var targetedDemographicActionCount = $("#demograph-target-list .advanced_targeting_options").size();
    if (targetedDemographicActionCount == CrowdTap.MAX_TARGETED_ACTION_COUNT) {
      $("#add-demograph-target").hide();
      $("#target-demograph-limit-reached-notice").show();
    } else {
      $("#target-demograph-limit-reached-notice").hide();
      $("#add-demograph-target").show();
    }
  };

  $(checkForMaxTargetedDemographicActions);

  //
  // Previous Action Targeting
  //
  $("#add-action-target").click(function() {
    $("#previous-targeting-actions").show();
    $(this).hide();
    return false;
  });

  $("#previous-targeting-actions").change(function() {
    var value = $.trim($(this).val());

    $(this).hide();
    $("#add-action-target").show();

    if (value == "") {
      return false;
    }

    $("#add-action-target").hide();
    $("#advanced-targeting-summary").spinner();

    $.ajax({
      url  : CrowdTap.routes.clients_brand_action_previous_action_target_forms,
      type : "GET",
      data : {
        "brand_action_id"    : CrowdTap.brand_action_id,
        "previous_action_id" : value
      },
      dataType : "html",
      success  : function(data) {
        $("#add-action-target").show();
        $("#advanced-targeting-summary").unspinner();
        $("#previous-actions-target-list").append(data);
        checkForMaxTargetedPreviousActions();
      }
    });
  });

  var checkForMaxTargetedPreviousActions = function() {
    var targetedPreviousActionCount = $("#previous-actions-target-list .advanced_targeting_options").size();
    if (targetedPreviousActionCount == CrowdTap.MAX_TARGETED_ACTION_COUNT) {
      $("#add-action-target").hide();
      $("#target-action-limit-reached-notice").show();
    } else {
      $("#target-action-limit-reached-notice").hide();
      $("#add-action-target").show();
    }
  };

  $(checkForMaxTargetedPreviousActions);

  $("input.unselect_all").live("click", function() {
    $(".poll_option_for_" + brandActionId(this)).prop("checked", false);
  });
});
