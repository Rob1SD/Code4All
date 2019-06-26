package com.example.code4all.error;

import android.content.Context;
import android.widget.Toast;
import com.android.volley.*;
import com.example.code4all.R;
import com.example.code4all.serverhandler.ServerHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

public class ErrorNetwork extends VolleyError {

//    Keys for json search
    public static final String ERROR_MESSAGE_KEY = "message";
    public static final String ERROR_CODE_KEY = "code";

    public static final String ERROR_CODE_INCORRECT_TOKEN_VALUE = "INCORRECT_TOKEN";



    private JSONObject errorContent;


    public ErrorNetwork(VolleyError volleyError, Context context) throws JSONException {
        errorContent = new JSONObject();
        errorContent.put(ERROR_MESSAGE_KEY, setMessage(volleyError, context));

//            int statusCode = volleyError.networkResponse.statusCode;
//            if (volleyError.networkResponse.data != null) {
//                JSONObject dataJsonMessage = new JSONObject(new String(volleyError.networkResponse.data, "UTF-8"));
//                errorContent.put(ERROR_MESSAGE_KEY, ServerHandler.getStringFromJsonObject(dataJsonMessage, ERROR_MESSAGE_KEY));
//            } else {
//                errorContent.put(ERROR_MESSAGE_KEY, "Check your internet connection");
//            }

    }
    public static String parseVolleyError(VolleyError error, Context context){
        try {
            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
            JSONObject data = new JSONObject(responseBody);
            String message = data.getString(ERROR_MESSAGE_KEY);
            return message;
        } catch (JSONException e){e.printStackTrace();}

        return null;
    }

    public static String getErrorCode(VolleyError error){
        try {
            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
            JSONObject data = new JSONObject(responseBody);
            return data.getString(ERROR_CODE_KEY);
        } catch (JSONException e){e.printStackTrace();}

        return null;
    }

    public static String getVolleyError(VolleyError error, Context context){
        try {
            if (error instanceof NetworkError) {
                return context.getString(R.string.network_error_network_error);

            } else if (error instanceof ServerError) {
                return context.getString(R.string.network_error_server_error);

            } else if (error instanceof AuthFailureError) {
                String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                JSONObject data = new JSONObject(responseBody);
                return data.getString(ERROR_MESSAGE_KEY);

            } else if (error instanceof ParseError) {
                return context.getString(R.string.network_error_parser_error);

            } else if (error instanceof TimeoutError) {
                return context.getString(R.string.network_error_time_out);
            }

        }
        catch (JSONException ignored) {}

        return null;
    }


    private String setMessage(VolleyError error, Context context) {
        /*
        if (error.networkResponse != null) {
            if (error.networkResponse.data != null) {
                JSONObject dataJsonMessage = new JSONObject(new String(error.networkResponse.data, StandardCharsets.UTF_8));
                return ServerHandler.getStringFromJsonObject(dataJsonMessage, ERROR_MESSAGE_KEY);
            }
        }*/


        return "";
    }

    public String diplayErrorMessage(){
        try {
            return ServerHandler.getStringFromJsonObject(errorContent, ERROR_MESSAGE_KEY);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return "";
    }
}
