module App exposing (..)

import Debug
import Html exposing (Html, text, div, img, node)
import Html.Attributes exposing (attribute, class, src)
import Html.Events exposing (onClick, on)
import Json.Decode as JD
import Polymer.App as PA
import Polymer.Attributes exposing (icon, label)
import Polymer.Paper as Paper


type alias Model =
    { message : String
    , logo : String
    }


init : String -> ( Model, Cmd Msg )
init path =
    ( { message = "Guitar router is loading ...", logo = path }, Cmd.none )


type Msg
    = NoOp
    | GenericSelect String
    | SelectedItemChanged


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case (Debug.log "Update" (toString msg)) of
        _ ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    PA.drawerLayout []
        [ drawer
        , PA.headerLayout []
            [ header model
            , tableCard model
            ]
        ]


drawer : Html Msg
drawer =
    PA.drawer []
        [ div [ class "drawer-contents" ] [] ]


header : Model -> Html Msg
header model =
    PA.header
        [ attribute "fixed" ""
        , attribute "effects" "waterfall"
        ]
        [ PA.toolbar []
            [ Paper.iconButton
                [ icon "menu"
                  --                , attribute "drawer-toggle" ""
                ]
                []
            , div
                [ attribute "main-title" "" ]
                [ text "Guitar Router" ]
            , div []
                [ node "iron-icon" [ class "logo", src model.logo ] [] ]
            ]
        ]


tableCard : Model -> Html Msg
tableCard model =
    Paper.card
        [ attribute "heading" "Presets"
        , attribute "elevation" "3"
        ]
        [ div
            [ class "card-content" ]
            [ table model ]
        , div
            [ class "card-actions" ]
            [ Paper.button [ class "primary" ] [ text "Aggiungi" ]
            , Paper.button [ class "secondary" ] [ text "Aggiorna" ]
            , Paper.button [ class "secondary", attribute "disabled" "" ] [ text "Modifica" ]
            , Paper.button [ class "secondary", attribute "disabled" "" ] [ text "Elimina" ]
            ]
        ]


decodeSelectedItemChanged : JD.Decoder Msg
decodeSelectedItemChanged =
    JD.succeed SelectedItemChanged


table : Model -> Html Msg
table model =
    div []
        [ node "vaadin-grid"
            [ attribute "visible-rows" "09"
            , on "selected-items-changed" decodeSelectedItemChanged
            ]
            [ Html.table
                []
                [ Html.colgroup
                    []
                    [ Html.col [ attribute "flex" "1" ] []
                    , Html.col [ attribute "flex" "1" ] []
                    , Html.col [ attribute "flex" "1" ] []
                    , Html.col [ attribute "flex" "1" ] []
                    ]
                , Html.thead
                    []
                    [ Html.tr
                        []
                        [ Html.th [] [ text "Id" ]
                        , Html.th [] [ text "Nome" ]
                        , Html.th [] [ text "Valore" ]
                        , Html.th [] [ text "Enabled" ]
                        ]
                    ]
                , Html.tbody
                    []
                    (tableBody model)
                ]
            ]
        ]


tableBody : Model -> List (Html Msg)
tableBody model =
    [ Html.tr
        []
        [ Html.td [] [ text "0" ]
        , Html.td [] [ text "Carmine" ]
        , Html.td [] [ text "74" ]
        , Html.td [] [ node "paper-checkbox" [ attribute "checked" "" ] [] ]
        ]
    , Html.tr
        []
        [ Html.td [] [ text "1" ]
        , Html.td [] [ text "Francesco" ]
        , Html.td [] [ text "77" ]
        , Html.td [] [ node "paper-checkbox" [ attribute "checked" "" ] [] ]
        ]
    , Html.tr
        []
        [ Html.td [] [ text "2" ]
        , Html.td [] [ text "Anna" ]
        , Html.td [] [ text "80" ]
        , Html.td [] [ node "paper-checkbox" [ attribute "checked" "" ] [] ]
        ]
    , Html.tr
        []
        [ Html.td [] [ text "3" ]
        , Html.td [] [ text "Enrico" ]
        , Html.td [] [ text "09" ]
        , Html.td [] [ node "paper-checkbox" [ attribute "checked" "" ] [] ]
        ]
    , Html.tr
        []
        [ Html.td [] [ text "4" ]
        , Html.td [] [ text "Assunta" ]
        , Html.td [] [ text "17" ]
        , Html.td [] [ node "paper-checkbox" [ attribute "checked" "" ] [] ]
        ]
    ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
